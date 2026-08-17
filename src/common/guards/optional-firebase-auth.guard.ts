import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { getFirebaseAdmin } from "../../config/firebase-admin";

/**
 * Allows the request through whether or not a valid token is present.
 * If a valid token IS present, req.user is populated so the order can be
 * linked to the account. This is what enables guest checkout while still
 * supporting signed-in customers.
 */
@Injectable()
export class OptionalFirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = await getFirebaseAdmin().auth().verifyIdToken(token);
        req.user = decoded;
      } catch {
        req.user = null;
      }
    }

    return true;
  }
}
