const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

let server: any;

async function bootstrap() {
  if (server) {
    return server;
  }

  // Dynamic import do AppModule
  const { AppModule } = await import('../src/app.module');

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter);

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('FINDUO API')
    .setDescription('Financial management for couples - Multi-tenant SaaS API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Couple', 'Couple (tenant) management')
    .addTag('Accounts', 'Financial accounts management')
    .addTag('Transactions', 'Transaction tracking and management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();

  server = expressApp;
  return server;
}

module.exports = async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};
