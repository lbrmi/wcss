import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.AMQP_URI],
  //     queue: 'send_message',
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });
  //
  // useContainer(app.select(AppModule), {
  //   fallbackOnErrors: true,
  // });
  //
  // await app.startAllMicroservices();
  // await app.listen(process.env.PORT);
  // console.log(
  //   'Project Running ',
  //   process.env.APP_NAME,
  //   'On Port',
  //   process.env.PORT,
  // );

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AMQP_URI],
        queue: 'send_message',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
