import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('sender')
export class AppController {
  constructor(private readonly service: AppService) {}

  @MessagePattern('send_message')
  async sendMessage(@Payload() data: any) {
    try {
      await this.service.send(data);
    } catch (e) {
      console.log('RMQ Message Receiving error', e.message);
    }
  }
}
