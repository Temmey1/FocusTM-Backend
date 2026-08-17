import { Controller, Post, Body, UseGuards, Req, ForbiddenException } from "@nestjs/common";
import { getFirebaseAdmin } from "../../config/firebase-admin";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";

@Controller("auth")
export class AuthController {
  /**
   * One-time bootstrap endpoint: promotes a user to admin if a matching
   * ADMIN_SETUP_SECRET is provided in the request body. Set ADMIN_SETUP_SECRET
   * in your .env, call this once for your account, then remove/disable it.
   */
  @UseGuards(FirebaseAuthGuard)
  @Post("make-admin")
  async makeAdmin(@Req() req: any, @Body("secret") secret: string) {
    if (!process.env.ADMIN_SETUP_SECRET || secret !== process.env.ADMIN_SETUP_SECRET) {
      throw new ForbiddenException("Invalid setup secret");
    }

    await getFirebaseAdmin().auth().setCustomUserClaims(req.user.uid, { admin: true });
    return { success: true, message: "User promoted to admin. Sign out and back in to refresh token." };
  }
}
