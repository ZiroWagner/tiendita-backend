import { UsersService } from './users.service';
import { StorageService } from '../storage/storage.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly storageService;
    constructor(usersService: UsersService, storageService: StorageService);
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
    findMe(req: any): Promise<{
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
    updateMe(req: any, updateUserDto: UpdateUserDto): Promise<{
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
    updateMyProfile(req: any, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        avatar: string | null;
        userId: string;
    }>;
    updateProfileWithAvatar(id: string, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File): Promise<{
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
