import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                address: string | null;
                avatar: string | null;
                userId: string;
            };
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(req: any, loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    getProfile(req: any): any;
}
