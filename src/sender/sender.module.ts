import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';
import { SenderController } from './sender.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [SenderController],
  providers: [SenderService, PrismaService],
  exports: [],
})
export class SenderModule {}
