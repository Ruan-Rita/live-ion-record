import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Converte automaticamente o payload para uma instância do DTO
    whitelist: true, // Remove campos não declarados no DTO
    forbidNonWhitelisted: true, // Rejeita payload com campos não permitidos
  }));
  app.enableCors();
  app.useBodyParser()
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
