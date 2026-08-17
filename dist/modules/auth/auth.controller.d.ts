export declare class AuthController {
    makeAdmin(req: any, secret: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
