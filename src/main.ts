import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQURI],
      queue: 'send_message',
      queueOptions: {
        durable: true,
      },
    },
  });
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
  console.log(
    'Project Running ',
    process.env.APP_NAME,
    'On Port',
    process.env.PORT,
  );
}
bootstrap();
