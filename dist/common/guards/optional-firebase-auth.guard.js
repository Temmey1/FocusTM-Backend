"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalFirebaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("../../config/firebase-admin");
let OptionalFirebaseAuthGuard = class OptionalFirebaseAuthGuard {
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = await (0, firebase_admin_1.getFirebaseAdmin)().auth().verifyIdToken(token);
                req.user = decoded;
            }
            catch {
                req.user = null;
            }
        }
        return true;
    }
};
exports.OptionalFirebaseAuthGuard = OptionalFirebaseAuthGuard;
exports.OptionalFirebaseAuthGuard = OptionalFirebaseAuthGuard = __decorate([
    (0, common_1.Injectable)()
], OptionalFirebaseAuthGuard);
//# sourceMappingURL=optional-firebase-auth.guard.js.map