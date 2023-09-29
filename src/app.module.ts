import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SenderModule } from './sender/sender.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SenderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
