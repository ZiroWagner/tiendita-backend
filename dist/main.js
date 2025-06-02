"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Tiendita API')
        .setDescription('API for grocery store POS application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.getHttpAdapter().get('/', (req, res) => {
        res.redirect('/api');
    });
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map