import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guard';
import { HttpExceptionFilter } from './common/filter';
import { LoggingInterceptor, ResponseInterceptor } from './common/interceptor';
import { CheckVerifyGuard } from './model/user/guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const reflector = app.get(Reflector);
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalGuards(new JwtGuard(reflector));
  app.useGlobalGuards(new CheckVerifyGuard(reflector));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(json({ limit: '50mb' }));
  await app.listen(config.get('PORT'));
}
bootstrap();
