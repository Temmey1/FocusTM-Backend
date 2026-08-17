import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";

/**
 * Checks for an `admin: true` custom claim on the Firebase user token.
 * Set this claim via the Firebase Admin SDK, e.g.:
 *   admin.auth().setCustomUserClaims(uid, { admin: true });
 * Run this once for your own account after signing up through the app.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req.user?.admin) {
      throw new ForbiddenException("Admin access required");
    }
    return true;
  }
}
