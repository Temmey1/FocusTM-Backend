import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers (helmet) — sensible defaults, CSP left off since this
  // is a pure JSON API consumed by separate frontends.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_URL    || "http://localhost:3001",
    "http://localhost:3000",
    "http://localhost:3001",
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`FocusTM API running on http://localhost:${port}`);
}
bootstrap();
