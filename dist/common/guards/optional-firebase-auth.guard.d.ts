import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class OptionalFirebaseAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
