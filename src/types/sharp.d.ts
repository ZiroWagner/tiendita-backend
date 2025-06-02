declare module 'sharp' {
  interface Sharp {
    webp(options?: WebpOptions): Sharp;
    resize(options?: ResizeOptions): Sharp;
    metadata(): Promise<Metadata>;
    toBuffer(): Promise<Buffer>;
  }

  interface WebpOptions {
    quality?: number;
    lossless?: boolean;
    nearLossless?: boolean;
    alphaQuality?: number;
    force?: boolean;
  }

  interface ResizeOptions {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    position?: string | number;
    background?: string | object;
    kernel?: string;
    withoutEnlargement?: boolean;
    withoutReduction?: boolean;
    fastShrinkOnLoad?: boolean;
  }

  interface Metadata {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    space?: string;
    channels?: number;
    depth?: string;
    density?: number;
    chromaSubsampling?: string;
    isProgressive?: boolean;
    pages?: number;
    pageHeight?: number;
    loop?: number;
    delay?: number[];
    hasProfile?: boolean;
    hasAlpha?: boolean;
    orientation?: number;
    exif?: Buffer;
    icc?: Buffer;
    iptc?: Buffer;
    xmp?: Buffer;
  }

  function sharp(input?: Buffer | string): Sharp;
  
  export = sharp;
}
