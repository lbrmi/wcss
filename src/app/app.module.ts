import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
