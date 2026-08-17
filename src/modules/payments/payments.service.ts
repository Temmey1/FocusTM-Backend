import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

/**
 * Monnify integration scaffold.
 * Flow:
 *  1. authenticate() -> get a short-lived access token using API key + secret key
 *  2. initializeTransaction() -> create a transaction and get a checkoutUrl to redirect the customer to
 *  3. Monnify calls your webhook (configure in Monnify dashboard) on payment completion
 *  4. verifyTransaction() -> confirm status server-side before marking the order as paid
 *
 * Fill in MONNIFY_API_KEY, MONNIFY_SECRET_KEY, MONNIFY_CONTRACT_CODE in .env once
 * you have a Monnify merchant account (sandbox first, then go live).
 */
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private config: ConfigService) {}

  private get baseUrl() {
    return this.config.get<string>("MONNIFY_BASE_URL") || "https://sandbox.monnify.com";
  }

  private async authenticate(): Promise<string | null> {
    const apiKey = this.config.get<string>("MONNIFY_API_KEY");
    const secretKey = this.config.get<string>("MONNIFY_SECRET_KEY");
    if (!apiKey || !secretKey) {
      this.logger.warn("Monnify credentials not set — skipping authentication");
      return null;
    }

    const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");
    const res = await axios.post(
      `${this.baseUrl}/api/v1/auth/login`,
      {},
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    return res.data?.responseBody?.accessToken || null;
  }

  async initializeTransaction(params: {
    amount: number;
    customerName: string;
    customerEmail: string;
    paymentReference: string;
    redirectUrl: string;
  }): Promise<{ checkoutUrl: string | null }> {
    const token = await this.authenticate();
    if (!token) return { checkoutUrl: null };

    const contractCode = this.config.get<string>("MONNIFY_CONTRACT_CODE");

    const res = await axios.post(
      `${this.baseUrl}/api/v1/merchant/transactions/init-transaction`,
      {
        amount: params.amount,
        customerName: params.customerName,
        customerEmail: params.customerEmail || "guest@focustm.com",
        paymentReference: params.paymentReference,
        paymentDescription: "FocusTM Collection Order",
        currencyCode: "NGN",
        contractCode,
        redirectUrl: params.redirectUrl,
        paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { checkoutUrl: res.data?.responseBody?.checkoutUrl || null };
  }

  async verifyTransaction(transactionReference: string): Promise<{ paid: boolean; raw?: any }> {
    const token = await this.authenticate();
    if (!token) return { paid: false };

    const res = await axios.get(
      `${this.baseUrl}/api/v2/transactions/${transactionReference}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const status = res.data?.responseBody?.paymentStatus;
    return { paid: status === "PAID", raw: res.data };
  }
}
