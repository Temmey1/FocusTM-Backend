import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PushSubscription, PushSubscriptionDocument } from "./push-subscription.schema";
import * as https from "https";
import * as http from "http";
import { ConfigService } from "@nestjs/config";
import { webcrypto } from "node:crypto";

// The Web Crypto API (crypto.subtle, crypto.getRandomValues) is only a
// global on Node 19+. Importing it explicitly means this works the same on
// whatever Node version a host actually provisions, instead of silently
// throwing "crypto is not defined" if it lands on Node 18.
//
// Typed as `any` deliberately: newer @types/node made Uint8Array generic
// over ArrayBufferLike while lib.dom's Crypto/SubtleCrypto types still want
// a plain ArrayBuffer, which makes every raw byte array below fail to
// typecheck against the strict DOM signatures even though it's fine at
// runtime. This is Node-only backend code, never running in a browser, so
// there's no risk in relaxing the type here rather than sprinkling casts
// through two dozen call sites below.
const crypto: any = (globalThis as any).crypto ?? webcrypto;

export interface WebPushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
  timestamp?: number;
}

function b64urlToUint8(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const raw = Buffer.from(base64, "base64").toString("binary");
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function uint8ToB64url(buf: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buf.byteLength; i++) binary += String.fromCharCode(buf[i]);
  return Buffer.from(binary, "binary")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function concatUint8(arrays: Uint8Array[]): Uint8Array {
  const totalLen = arrays.reduce((s, a) => s + a.byteLength, 0);
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.byteLength;
  }
  return out;
}

async function hmacSha256(key: Uint8Array, data: Uint8Array): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, data);
}

async function hkdfExtractExpand(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const prk = new Uint8Array(await hmacSha256(salt, ikm));
  let t = new Uint8Array(0);
  const okmParts: Uint8Array[] = [];
  let counter = 1;
  while (okmParts.reduce((s, p) => s + p.byteLength, 0) < length) {
    const input = concatUint8([t, info, new Uint8Array([counter])]);
    t = new Uint8Array(await hmacSha256(prk, input));
    okmParts.push(t);
    counter++;
  }
  return concatUint8(okmParts).slice(0, length);
}

async function ecdhComputeSecret(publicKeyJwk: any, privateKeyJwk: any): Promise<Uint8Array> {
  const [pub, priv] = await Promise.all([
    crypto.subtle.importKey(
      "jwk",
      publicKeyJwk,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      [],
    ),
    crypto.subtle.importKey(
      "jwk",
      privateKeyJwk,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      ["deriveBits"],
    ),
  ]);
  return new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: pub }, priv, 256),
  );
}

@Injectable()
export class PushSubscriptionsService {
  private readonly logger = new Logger(PushSubscriptionsService.name);

  constructor(
    @InjectModel(PushSubscription.name) private model: Model<PushSubscriptionDocument>,
    private config: ConfigService,
  ) {}

  // Was previously declared as `private get vapidKeys()` and called with
  // `()` at both use sites below — a getter can't be invoked like a
  // function, so this never actually compiled. Made it a plain method.
  private getVapidKeypair() {
    const privateB64 = this.config.get<string>("VAPID_PRIVATE_KEY");
    const publicB64 = this.config.get<string>("VAPID_PUBLIC_KEY");
    if (!privateB64 || !publicB64) return null;
    const privateBytes = b64urlToUint8(privateB64);
    const publicBytes = b64urlToUint8(publicB64);
    if (privateBytes.length !== 32) return null;
    return { privateBytes, publicBytes, publicB64 };
  }

  getVapidPublicKey(): string | null {
    return this.getVapidKeypair()?.publicB64 ?? null;
  }

  async subscribe(dto: { userId: string; userEmail?: string; endpoint: string; keys: { p256dh: string; auth: string }; scope?: string }) {
    const filter = { userId: dto.userId, endpoint: dto.endpoint };
    const update = {
      userId: dto.userId,
      userEmail: dto.userEmail,
      endpoint: dto.endpoint,
      keys: dto.keys,
      scope: dto.scope || "admin",
      enabled: true,
      lastError: null,
    };
    return this.model.findOneAndUpdate(filter, update, { upsert: true, new: true, setDefaultsOnInsert: true }).exec();
  }

  async setEnabled(userId: string, endpoint: string, enabled: boolean) {
    return this.model.updateOne({ userId, endpoint }, { enabled, lastError: null }).exec();
  }

  async listForScope(scope: string) {
    return this.model.find({ scope, enabled: true }).exec();
  }

  async mySubscriptions(userId: string) {
    return this.model.find({ userId }).exec();
  }

  async unsubscribe(userId: string, endpoint: string): Promise<any> {
    return this.model.deleteOne({ userId, endpoint }).exec();
  }

  private async encryptPayload(payloadBytes: Uint8Array, userPublicKey: Uint8Array, userAuth: Uint8Array, serverPubBytes: Uint8Array, serverPrivJwk: any) {
    const userPubJwk = this.rawToJwk(userPublicKey, "P-256");
    const ecdhSecret = await ecdhComputeSecret(userPubJwk, serverPrivJwk);

    const salt = crypto.getRandomValues(new Uint8Array(16));

    const info = concatUint8([
      new TextEncoder().encode("WebPush: info\x00"),
      userPublicKey,
      serverPubBytes,
    ]);
    const ikm = await hkdfExtractExpand(userAuth, ecdhSecret, info, 32);

    const cekInfo = concatUint8([
      new TextEncoder().encode("Content-Encoding: aes128gcm\x00"),
      new Uint8Array(0),
    ]);
    const nonceInfo = concatUint8([
      new TextEncoder().encode("Content-Encoding: nonce\x00"),
      new Uint8Array(0),
    ]);

    const cek = await hkdfExtractExpand(salt, ikm, cekInfo, 16);
    const nonce = await hkdfExtractExpand(salt, ikm, nonceInfo, 12);

    const iv = new Uint8Array(nonce.byteLength);
    iv.set(nonce);
    const recordSize = payloadBytes.byteLength + 16 + 1;
    const padded = new Uint8Array(recordSize - 16);
    padded.set(payloadBytes);
    padded[payloadBytes.byteLength] = 0x02;

    const aesKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, padded));

    const header = new Uint8Array(salt.byteLength + 4 + 1 + serverPubBytes.byteLength);
    header.set(salt, 0);
    const rs = new DataView(header.buffer, salt.byteLength, 4);
    rs.setUint32(0, recordSize, false);
    header[salt.byteLength + 4] = serverPubBytes.byteLength;
    header.set(serverPubBytes, salt.byteLength + 5);

    return concatUint8([header, encrypted]);
  }

  private rawToJwk(raw: Uint8Array, crv: string) {
    if (raw.length !== 65) throw new Error("raw key must be 65 bytes uncompressed");
    const x = uint8ToB64url(raw.slice(1, 33));
    const y = uint8ToB64url(raw.slice(33, 65));
    return { kty: "EC", crv, x, y, ext: true };
  }

  private async genServerKeyPair() {
    const pair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
    const [pubJwk, privJwk] = await Promise.all([
      crypto.subtle.exportKey("jwk", pair.publicKey) as any,
      crypto.subtle.exportKey("jwk", pair.privateKey) as any,
    ]);
    const x = b64urlToUint8(pubJwk.x);
    const y = b64urlToUint8(pubJwk.y);
    const serverPub = concatUint8([new Uint8Array([0x04]), x, y]);
    return { serverPub, privJwk };
  }

  private async generateVapidToken(endpointUrl: URL, serverPubB64: string, serverPrivBytes: Uint8Array) {
    const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 12;
    const header = { alg: "ES256", typ: "JWT" };
    const payload = { aud: audience, exp, sub: `mailto:${this.config.get<string>("VAPID_CONTACT_EMAIL") || "admin@focustm.com"}` };
    const signingInput = `${uint8ToB64url(new TextEncoder().encode(JSON.stringify(header)))}.${uint8ToB64url(new TextEncoder().encode(JSON.stringify(payload)))}`;

    const dJwk = {
      kty: "EC",
      crv: "P-256",
      d: uint8ToB64url(serverPrivBytes),
      x: "",
      y: "",
      ext: true,
    };

    const publicBytes = b64urlToUint8(serverPubB64);
    if (publicBytes.length === 65) {
      dJwk.x = uint8ToB64url(publicBytes.slice(1, 33));
      dJwk.y = uint8ToB64url(publicBytes.slice(33, 65));
    }

    const privKey = await crypto.subtle.importKey("jwk", dJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
    const signature = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privKey, new TextEncoder().encode(signingInput)));
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);
    return `${signingInput}.${uint8ToB64url(concatUint8([r, s]))}`;
  }

  private async sendOne(sub: PushSubscriptionDocument, payloadJson: string) {
    const vapid = this.getVapidKeypair();
    if (!vapid) {
      this.logger.warn("Skipping web push: VAPID keys not configured. Set VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and optionally VAPID_CONTACT_EMAIL in .env");
      return { ok: false, reason: "missing-vapid" };
    }

    let endpointUrl: URL;
    try {
      endpointUrl = new URL(sub.endpoint);
    } catch {
      return { ok: false, reason: "invalid-endpoint" };
    }
    if (!endpointUrl.hostname || !endpointUrl.protocol) {
      return { ok: false, reason: "invalid-endpoint" };
    }

    const userPublicKey = b64urlToUint8(sub.keys.p256dh);
    const userAuth = b64urlToUint8(sub.keys.auth);

    const { serverPub, privJwk } = await this.genServerKeyPair();
    const serverPubB64Local = uint8ToB64url(serverPub);
    this.rawToJwk(serverPub, "P-256");

    const payloadBytes = new TextEncoder().encode(payloadJson);
    const encrypted = await this.encryptPayload(payloadBytes, userPublicKey, userAuth, serverPub, privJwk);

    const token = await this.generateVapidToken(endpointUrl, vapid.publicB64, vapid.privateBytes);

    const options: http.RequestOptions = {
      hostname: endpointUrl.hostname,
      port: endpointUrl.port ? Number(endpointUrl.port) : (endpointUrl.protocol === "https:" ? 443 : 80),
      path: endpointUrl.pathname + endpointUrl.search,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "aes128gcm",
        TTL: "43200",
        Authorization: `vapid t=${token}, k=${vapid.publicB64}`,
        "Crypto-Key": `dh=${serverPubB64Local}`,
        "Content-Length": encrypted.byteLength,
      },
    };

    return new Promise<{ ok: boolean; status?: number; reason?: string }>((resolve) => {
      const transport = endpointUrl.protocol === "https:" ? https : http;
      const req = transport.request(options, (res) => {
        const status = res.statusCode ?? 0;
        resolve({ ok: status >= 200 && status < 300, status });
      });
      req.on("error", (err) => resolve({ ok: false, reason: (err as Error).message }));
      req.write(Buffer.from(encrypted.buffer, encrypted.byteOffset, encrypted.byteLength));
      req.end();
    });
  }

  async broadcastToAdmins(payload: WebPushPayload) {
    const subs = await this.listForScope("admin");
    const payloadJson = JSON.stringify(payload);
    let sent = 0;
    for (const sub of subs) {
      try {
        const r = await this.sendOne(sub, payloadJson);
        if (r.ok) {
          sent++;
          if (sub.lastError) {
            this.model.updateOne({ _id: sub._id }, { lastError: null }).exec().catch(() => undefined);
          }
        } else if (r.status && (r.status === 404 || r.status === 410)) {
          this.model.deleteOne({ _id: sub._id }).exec().catch(() => undefined);
        } else {
          this.logger.warn(`Web push failed for endpoint ${sub.endpoint.slice(0, 40)}...: ${r.status} ${r.reason || ""}`);
          this.model.updateOne({ _id: sub._id }, { lastError: r.reason || `HTTP ${r.status}` }).exec().catch(() => undefined);
        }
      } catch (err) {
        this.logger.error("Web push send error", err as Error);
      }
    }
    return { targetCount: subs.length, sent };
  }
}
