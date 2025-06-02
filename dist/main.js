"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
async function downloadSwaggerAssets() {
    const swaggerUiAssetBasePath = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0';
    const assetsToDownload = [
        'swagger-ui.css',
        'swagger-ui-bundle.js',
        'swagger-ui-standalone-preset.js'
    ];
    const publicSwaggerPath = path.join(process.cwd(), 'public', 'swagger-ui');
    if (!fs.existsSync(publicSwaggerPath)) {
        fs.mkdirSync(publicSwaggerPath, { recursive: true });
    }
    for (const asset of assetsToDownload) {
        const assetUrl = `${swaggerUiAssetBasePath}/${asset}`;
        const assetPath = path.join(publicSwaggerPath, asset);
        if (fs.existsSync(assetPath)) {
            console.log(`Asset ${asset} already exists, skipping download`);
            continue;
        }
        try {
            const response = await axios_1.default.get(assetUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(assetPath, response.data);
            console.log(`Downloaded ${asset} successfully`);
        }
        catch (error) {
            console.error(`Failed to download ${asset}:`, error.message);
        }
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    if (process.env.NODE_ENV !== 'production') {
        await downloadSwaggerAssets();
    }
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Tiendita API')
        .setDescription('API for grocery store POS application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
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
    swagger_1.SwaggerModule.setup('api', app, document, customOptions);
    app.getHttpAdapter().get('/', (req, res) => {
        res.redirect('/api');
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map