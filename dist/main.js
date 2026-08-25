"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
    const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:3000",
        process.env.ADMIN_URL || "http://localhost:3001",
        "http://localhost:3000",
        "http://localhost:3001",
    ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin))
                callback(null, true);
            else
                callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`FocusTM API running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map