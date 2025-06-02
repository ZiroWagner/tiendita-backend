import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
    findByEmail(email: string): Promise<{
        name: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        avatar: string | null;
        userId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
