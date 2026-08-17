import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { getFirebaseAdmin } from "../../config/firebase-admin";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing auth token");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = await getFirebaseAdmin().auth().verifyIdToken(token);
      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
