import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Coffee Shop API')
  .setDescription('Coffee Shop Bookstore API with authentication, book management, and purchases')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
    },
    'JWT-auth',
  )
  .build();

export const createSwaggerDocument = (app: any) => {
  return SwaggerModule.createDocument(app, swaggerConfig);
};
