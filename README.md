# FocusTM Backend

NestJS REST API: Products, Orders, Firebase Auth verification, Monnify payments, Email notifications.

## Stack
NestJS · TypeScript · MongoDB Atlas (Mongoose) · Firebase Admin SDK · Monnify · Nodemailer

## Dev
```bash
npm install
cp .env.example .env
npm run seed        # seed sample products
npm run start:dev   # http://localhost:4000
```

## Deploy → Render
- Build: `npm install && npm run build`
- Start: `npm run start:prod`
- Set all env vars from `.env.example` in the Render dashboard.
- Set FRONTEND_URL and ADMIN_URL to your deployed Vercel domains.
