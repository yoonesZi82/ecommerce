import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  // app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));

  // swagger config -->
  const config = new DocumentBuilder()
    .setTitle('Shopping mal api')
    .setDescription('Description for shopping api')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
