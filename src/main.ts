import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

async function downloadSwaggerAssets() {
  const swaggerUiAssetBasePath = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0';
  const assetsToDownload = [
    'swagger-ui.css',
    'swagger-ui-bundle.js',
    'swagger-ui-standalone-preset.js'
  ];

  const publicSwaggerPath = path.join(process.cwd(), 'public', 'swagger-ui');
  
  // Ensure directory exists
  if (!fs.existsSync(publicSwaggerPath)) {
    fs.mkdirSync(publicSwaggerPath, { recursive: true });
  }

  for (const asset of assetsToDownload) {
    const assetUrl = `${swaggerUiAssetBasePath}/${asset}`;
    const assetPath = path.join(publicSwaggerPath, asset);
    
    // Skip if file already exists
    if (fs.existsSync(assetPath)) {
      console.log(`Asset ${asset} already exists, skipping download`);
      continue;
    }
    
    try {
      const response = await axios.get(assetUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(assetPath, response.data);
      console.log(`Downloaded ${asset} successfully`);
    } catch (error) {
      console.error(`Failed to download ${asset}:`, error.message);
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Download Swagger assets in development
  if (process.env.NODE_ENV !== 'production') {
    await downloadSwaggerAssets();
  }

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Tiendita API')
    .setDescription('API for grocery store POS application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Custom Swagger setup with path to static assets
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCssUrl: '/swagger-static/swagger-ui/swagger-ui.css',
    customJs: [
      '/swagger-static/swagger-ui/swagger-ui-bundle.js',
      '/swagger-static/swagger-ui/swagger-ui-standalone-preset.js'
    ],
  };

  SwaggerModule.setup('api', app, document, customOptions);

  // Redireccionar la ruta raíz a la documentación Swagger
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api');
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();
