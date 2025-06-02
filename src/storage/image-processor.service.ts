import { Injectable } from '@nestjs/common';
// Importar Sharp usando la sintaxis de importación adecuada
import sharp from 'sharp';
// Si la importación anterior causa problemas, usar esta alternativa:
// const sharp = require('sharp');

@Injectable()
export class ImageProcessorService {
  /**
   * Comprime una imagen y la convierte a formato WebP
   * @param buffer Buffer de la imagen original
   * @param quality Calidad de la imagen (1-100)
   * @returns Buffer de la imagen comprimida en formato WebP
   */
  async compressAndConvertToWebP(buffer: Buffer, quality = 80): Promise<Buffer> {
    try {
      // Procesar la imagen con sharp
      if (!buffer || buffer.length === 0) {
        throw new Error('Buffer de imagen vacío o inválido');
      }
      
      // Usar sharp de manera segura
      // Verificar que sharp es una función válida
      if (typeof sharp !== 'function') {
        throw new Error('Sharp no está disponible como una función');
      }
      
      const sharpInstance = sharp(buffer);
      if (!sharpInstance) {
        throw new Error('No se pudo crear instancia de sharp');
      }
      
      return await sharpInstance
        .webp({ quality, lossless: false }) // Usar compresión con pérdida controlada para mejor balance
        .toBuffer();
    } catch (error) {
      console.error(`Error al procesar la imagen: ${error.message}`);
      // Si hay un error, devolver el buffer original
      return buffer;
    }
  }

  /**
   * Redimensiona una imagen si es demasiado grande
   * @param buffer Buffer de la imagen original
   * @param maxWidth Ancho máximo
   * @param maxHeight Alto máximo
   * @returns Buffer de la imagen redimensionada
   */
  async resizeIfNeeded(buffer: Buffer, maxWidth = 1200, maxHeight = 1200): Promise<Buffer> {
    try {
      if (!buffer || buffer.length === 0) {
        throw new Error('Buffer de imagen vacío o inválido');
      }
      
      // Crear instancia de sharp de manera segura
      // Verificar que sharp es una función válida
      if (typeof sharp !== 'function') {
        throw new Error('Sharp no está disponible como una función');
      }
      
      const sharpInstance = sharp(buffer);
      if (!sharpInstance) {
        throw new Error('No se pudo crear instancia de sharp');
      }
      
      // Obtener metadatos de la imagen
      const metadata = await sharpInstance.metadata();
      
      // Si la imagen es más pequeña que las dimensiones máximas, no hacer nada
      if (
        !metadata.width || 
        !metadata.height || 
        (metadata.width <= maxWidth && metadata.height <= maxHeight)
      ) {
        return buffer;
      }
      
      // Redimensionar la imagen manteniendo la proporción
      return await sharpInstance
        .resize({
          width: metadata.width > maxWidth ? maxWidth : undefined,
          height: metadata.height > maxHeight ? maxHeight : undefined,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer();
    } catch (error) {
      console.error(`Error al redimensionar la imagen: ${error.message}`);
      // Si hay un error, devolver el buffer original
      return buffer;
    }
  }

  /**
   * Procesa una imagen: redimensiona si es necesario y convierte a WebP
   * @param buffer Buffer de la imagen original
   * @param quality Calidad de la imagen WebP (1-100)
   * @returns Buffer de la imagen procesada
   */
  async processImage(buffer: Buffer, quality = 80): Promise<Buffer> {
    try {
      if (!buffer || buffer.length === 0) {
        console.warn('Buffer de imagen vacío o inválido, devolviendo buffer original');
        return buffer;
      }
      
      // Primero redimensionar si es necesario
      let processedBuffer = buffer;
      try {
        const resizedBuffer = await this.resizeIfNeeded(buffer);
        processedBuffer = resizedBuffer;
      } catch (resizeError) {
        console.error(`Error al redimensionar: ${resizeError.message}. Continuando con el buffer original.`);
      }
      
      // Luego comprimir y convertir a WebP
      try {
        return await this.compressAndConvertToWebP(processedBuffer, quality);
      } catch (webpError) {
        console.error(`Error al convertir a WebP: ${webpError.message}. Devolviendo buffer redimensionado.`);
        return processedBuffer;
      }
    } catch (error) {
      console.error(`Error general al procesar la imagen: ${error.message}`);
      // Si hay un error, devolver el buffer original
      return buffer;
    }
  }
}
