import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigService } from '@nestjs/config';
import { ImageProcessorService } from './image-processor.service';

@Injectable()
export class StorageService implements OnModuleInit {
  // Definir nombres de buckets para diferentes tipos de archivos
  private readonly AVATARS_BUCKET = 'avatars';
  private readonly PRODUCTS_BUCKET = 'products';

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
    private readonly imageProcessor: ImageProcessorService,
  ) {}
  
  /**
   * Al iniciar el módulo, verificar que existan los buckets necesarios
   */
  async onModuleInit() {
    // Verificar y crear los buckets si no existen
    await this.ensureBucketExists(this.AVATARS_BUCKET);
    await this.ensureBucketExists(this.PRODUCTS_BUCKET);
  }
  
  /**
   * Verifica si un bucket existe y lo crea si no existe
   * @param bucketName Nombre del bucket a verificar/crear
   */
  private async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      // Verificar si el bucket existe
      const { data, error } = await this.supabaseService
        .getClient()
        .storage
        .getBucket(bucketName);
      
      if (error && error.message.includes('not found')) {
        console.log(`Bucket ${bucketName} no encontrado, creándolo...`);
        
        // Crear el bucket si no existe
        const { error: createError } = await this.supabaseService
          .getClient()
          .storage
          .createBucket(bucketName, {
            public: true, // Hacer el bucket público para acceder a los archivos
            fileSizeLimit: 5 * 1024 * 1024, // 5MB límite de tamaño
          });
        
        if (createError) {
          console.error(`Error al crear bucket ${bucketName}: ${createError.message}`);
        } else {
          console.log(`Bucket ${bucketName} creado exitosamente`);
        }
      } else if (error) {
        console.error(`Error al verificar bucket ${bucketName}: ${error.message}`);
      } else {
        console.log(`Bucket ${bucketName} ya existe`);
      }
    } catch (error) {
      console.error(`Error al verificar/crear bucket ${bucketName}: ${error.message}`);
    }
  }

  /**
   * Sube un archivo al almacenamiento de Supabase
   * @param file Archivo a subir
   * @param path Ruta base donde se guardará el archivo (ej: 'avatars', 'products')
   * @param fileName Nombre del archivo (opcional, si no se proporciona se usa el nombre original)
   * @param userId ID del usuario para avatares (opcional)
   * @param productId ID del producto para imágenes de productos (opcional)
   * @returns URL pública del archivo subido
   */
  async uploadFile(
    file: any,
    path: string,
    fileName?: string,
    userId?: string,
    productId?: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    try {
      // Determinar el bucket y la ruta completa según el tipo de archivo
      let bucketName: string;
      let filePath: string;
      
      if (path === 'avatars' && userId) {
        // Para avatares, usar el bucket de avatares
        bucketName = this.AVATARS_BUCKET;
        // Siempre usar extensión webp para mejor compresión
        filePath = `${userId}/avatar.webp`;
      } else if (path === 'products' && productId) {
        // Para productos, usar el bucket de productos
        bucketName = this.PRODUCTS_BUCKET;
        // Siempre usar extensión webp para mejor compresión
        filePath = `${productId}/image.webp`;
      } else {
        // Caso por defecto (no debería ocurrir con la nueva estructura)
        throw new BadRequestException('Tipo de archivo no soportado o falta ID de usuario/producto');
      }

      console.log(`Procesando imagen antes de subir a bucket: ${bucketName}, ruta: ${filePath}`);
      
      // Variable para almacenar el buffer de la imagen a subir
      let imageBufferToUpload: Buffer;
      let contentType = 'image/webp'; // Por defecto, intentamos usar WebP
      
      try {
        // Procesar la imagen: redimensionar y convertir a WebP
        const processedImageBuffer = await this.imageProcessor.processImage(file.buffer);
        
        // Verificar que el procesamiento fue exitoso comparando tamaños
        if (processedImageBuffer && processedImageBuffer.length > 0 && processedImageBuffer.length < file.buffer.length) {
          console.log(`Imagen procesada exitosamente. Tamaño original: ${file.buffer.length} bytes, tamaño procesado: ${processedImageBuffer.length} bytes`);
          imageBufferToUpload = processedImageBuffer;
        } else {
          console.warn(`El procesamiento no redujo el tamaño de la imagen o falló. Usando imagen original.`);
          imageBufferToUpload = file.buffer;
          contentType = file.mimetype; // Usar el tipo MIME original
        }
      } catch (processingError) {
        console.error(`Error al procesar la imagen: ${processingError.message}. Usando imagen original.`);
        imageBufferToUpload = file.buffer;
        contentType = file.mimetype; // Usar el tipo MIME original
      }
      
      console.log(`Subiendo archivo a bucket: ${bucketName}, ruta: ${filePath}, tipo: ${contentType}`);
      
      // Subir el archivo (procesado o original) a Supabase Storage
      const { data, error } = await this.supabaseService
        .getClient()
        .storage.from(bucketName)
        .upload(filePath, imageBufferToUpload, {
          contentType: contentType,
          upsert: true,
        });

      if (error) {
        throw new BadRequestException(`Error al subir el archivo: ${error.message}`);
      }

      // Obtener la URL pública del archivo
      const { data: urlData } = this.supabaseService
        .getClient()
        .storage.from(bucketName)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      throw new BadRequestException(`Error al subir el archivo: ${error.message}`);
    }
  }

  /**
   * Extrae información del bucket y la ruta de una URL
   * @param url URL del archivo
   * @returns Objeto con el nombre del bucket y la ruta del archivo
   */
  private extractStorageInfoFromUrl(url: string): { bucket: string; path: string } | null {
    try {
      console.log(`Extrayendo información de URL: ${url}`);
      
      // Analizar la URL para extraer información
      if (url.includes('/avatars/')) {
        // Es un avatar
        const parts = url.split('/avatars/');
        if (parts.length > 1) {
          const pathParts = parts[1].split('/');
          if (pathParts.length >= 2) {
            const userId = pathParts[0];
            const filename = pathParts[pathParts.length - 1];
            console.log(`Avatar detectado - userId: ${userId}, filename: ${filename}`);
            return {
              bucket: this.AVATARS_BUCKET,
              path: `${userId}/${filename}`
            };
          }
        }
      } else if (url.includes('/products/')) {
        // Es una imagen de producto
        const parts = url.split('/products/');
        if (parts.length > 1) {
          const pathParts = parts[1].split('/');
          if (pathParts.length >= 2) {
            const productId = pathParts[0];
            const filename = pathParts[pathParts.length - 1];
            console.log(`Producto detectado - productId: ${productId}, filename: ${filename}`);
            return {
              bucket: this.PRODUCTS_BUCKET,
              path: `${productId}/${filename}`
            };
          }
        }
      }
      
      console.log('No se pudo extraer información de la URL');
      return null;
    } catch (error) {
      console.error(`Error al extraer información de almacenamiento: ${error.message}`);
      return null;
    }
  }

  /**
   * Elimina un archivo del almacenamiento de Supabase
   * @param fileUrl URL pública del archivo a eliminar
   * @returns true si se eliminó correctamente
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!fileUrl) {
      console.log('No se proporcionó URL para eliminar');
      return false; // Si no hay URL, no hay nada que eliminar
    }

    console.log(`Intentando eliminar archivo con URL: ${fileUrl}`);

    try {
      // Extraer información del bucket y la ruta del archivo
      const storageInfo = this.extractStorageInfoFromUrl(fileUrl);
      
      if (!storageInfo) {
        console.error('No se pudo extraer información de almacenamiento de la URL');
        return false;
      }
      
      console.log(`Información extraída: bucket=${storageInfo.bucket}, path=${storageInfo.path}`);

      // Intentar eliminar el archivo
      const { error } = await this.supabaseService
        .getClient()
        .storage.from(storageInfo.bucket)
        .remove([storageInfo.path]);

      if (error) {
        console.error(`Error al eliminar el archivo: ${error.message}`);
        return false;
      }

      console.log(`Archivo eliminado exitosamente: ${storageInfo.path} del bucket ${storageInfo.bucket}`);
      return true;
    } catch (error) {
      throw new BadRequestException(`Error al eliminar el archivo: ${error.message}`);
    }
  }
}
