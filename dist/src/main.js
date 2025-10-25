"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FINDUO API')
        .setDescription('Financial management for couples - Multi-tenant SaaS API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Authentication', 'User authentication endpoints')
        .addTag('Couple', 'Couple (tenant) management')
        .addTag('Accounts', 'Financial accounts management')
        .addTag('Transactions', 'Transaction tracking and management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map