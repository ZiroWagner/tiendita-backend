import { StorageService } from './storage.service';
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    deleteFile(fileUrl: string): Promise<boolean>;
}
