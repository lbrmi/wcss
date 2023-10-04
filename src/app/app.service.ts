import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SendMessageData } from './app.dtos';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async send(data: SendMessageData) {
    const { message_id } = data;

    const init: RequestInit = {
      method: 'post',
      body: data.body,
      headers: data.headers,
    };

    const response = await fetch(data.url, init);

    const body = await response.json();

    await this.prisma.messages.update({
      where: {
        id: message_id,
      },
      data: {
        wa_message_id: body.messages[0].id,
      },
    });
  }
}
