import { Controller, Get, Post, Delete, Body, Put, UseGuards, Req, BadRequestException } from "@nestjs/common";
import { PushSubscriptionsService } from "./push-subscriptions.service";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";

@UseGuards(FirebaseAuthGuard)
@Controller("push-subscriptions")
export class PushSubscriptionsController {
  constructor(private readonly service: PushSubscriptionsService) {}

  @Get("public-key")
  getPublicKey() {
    const key = this.service.getVapidPublicKey();
    return { publicKey: key };
  }

  @Post()
  async subscribe(
    @Req() req: any,
    @Body() body: { endpoint: string; keys: { p256dh: string; auth: string }; scope?: string },
  ) {
    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
      throw new BadRequestException("subscription endpoint and keys are required");
    }
    const created = await this.service.subscribe({
      userId: req.user.uid,
      userEmail: req.user.email || undefined,
      endpoint: body.endpoint,
      keys: body.keys,
      scope: body.scope || "admin",
    });
    return created;
  }

  @Put("enabled")
  async setEnabled(
    @Req() req: any,
    @Body() body: { endpoint: string; enabled: boolean },
  ) {
    if (!body?.endpoint) throw new BadRequestException("endpoint is required");
    return this.service.setEnabled(req.user.uid, body.endpoint, !!body.enabled);
  }

  @Get("mine")
  mine(@Req() req: any) {
    return this.service.mySubscriptions(req.user.uid);
  }

  @Delete()
  async unsubscribe(@Req() req: any, @Body() body: { endpoint: string }) {
    if (!body?.endpoint) throw new BadRequestException("endpoint is required");
    return this.service.unsubscribe(req.user.uid, body.endpoint);
  }

  @UseGuards(AdminGuard)
  @Post("test")
  async sendTest(@Req() req: any, @Body() body?: { title?: string; body?: string }) {
    return this.service.broadcastToAdmins({
      title: body?.title || "FocusTM — Test notification",
      body: body?.body || "Web notifications are working. You'll receive these when new orders arrive.",
      requireInteraction: true,
      timestamp: Date.now(),
      data: { type: "test", from: req.user.uid },
    });
  }
}
