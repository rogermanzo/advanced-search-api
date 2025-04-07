import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Productos')
    .setDescription('Búsqueda avanzada con Elasticsearch')
    .setVersion('1.0')
    .addTag('Search')
    .build();

  // Accedemos al ConfigService para obtener variables de entorno
  const configService = app.get(ConfigService);
  
  // Configura Swagger
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Ruta accesible en /api

  // Escuchar en el puerto configurado desde el .env (por ejemplo, process.env.PORT)
  const port = configService.get('PORT') || 3000; // Si no se encuentra la variable, se usa el puerto 3000 por defecto
  await app.listen(port);

  console.log(`Aplicación corriendo en el puerto ${port}`);
}

bootstrap();
