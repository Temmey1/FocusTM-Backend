// Generates a VAPID keypair for Web Push and prints it in the exact
// base64url format push-subscriptions.service.ts expects:
//   - public key:  65-byte uncompressed EC point (0x04 + X + Y)
//   - private key: 32-byte raw 'd' scalar
// This is the same format the standard `web-push` npm package produces,
// so the output is also safe to hand to the browser's
// PushManager.subscribe({ applicationServerKey }) call on the frontend.
//
// Run once, copy the output into your backend's .env (and the admin
// frontend's NEXT_PUBLIC_VAPID_PUBLIC_KEY if you set that manually instead
// of fetching it from GET /push-subscriptions/public-key).

import { webcrypto } from "node:crypto";
const crypto: Crypto = (globalThis as any).crypto ?? (webcrypto as unknown as Crypto);

function uint8ToB64url(buf: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buf.byteLength; i++) binary += String.fromCharCode(buf[i]);
  return Buffer.from(binary, "binary")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlToUint8(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const raw = Buffer.from(base64, "base64").toString("binary");
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function main() {
  const pair = (await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;

  const rawPublic = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
  const jwkPrivate: any = await crypto.subtle.exportKey("jwk", pair.privateKey);
  const rawPrivate = b64urlToUint8(jwkPrivate.d);

  console.log("\nAdd these to your backend's .env:\n");
  console.log(`VAPID_PUBLIC_KEY=${uint8ToB64url(rawPublic)}`);
  console.log(`VAPID_PRIVATE_KEY=${uint8ToB64url(rawPrivate)}`);
  console.log(`VAPID_CONTACT_EMAIL=admin@focustm.com\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
