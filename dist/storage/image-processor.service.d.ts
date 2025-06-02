export declare class ImageProcessorService {
    compressAndConvertToWebP(buffer: Buffer, quality?: number): Promise<Buffer>;
    resizeIfNeeded(buffer: Buffer, maxWidth?: number, maxHeight?: number): Promise<Buffer>;
    processImage(buffer: Buffer, quality?: number): Promise<Buffer>;
}
