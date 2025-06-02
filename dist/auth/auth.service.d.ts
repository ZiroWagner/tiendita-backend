import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
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
}
