import { Injectable, Scope } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { PrismaService } from '../prisma.service';

export interface DataPayload {
  url: string;
  body: string;
  headers: any;
  message_id: any;
  project_code: string;
}

export interface DataPayload {
  messaging_product: string;
  contacts: any[];
  messages: any[];
}

@Injectable({
  scope: Scope.REQUEST,
})
export class SenderService {
  constructor(private readonly prisma: PrismaService) {} // @Inject("ROBO_SERVICE") private readonly client: ClientProxy

  async send(data: DataPayload) {
    const { message_id, project_code } = data;
    // console.log(JSON.stringify(data))
    const payload = {
      method: 'post',
      url: data.url,
      data: data.body,
      headers: data.headers,
    };
    console.log(payload);

    try {
      const response = await axios(payload);
      console.log(payload);
      const data: DataPayload = response.data;
      const mResponse = {
        wa_message_id: data.messages[0].id,
        message_id: message_id,
        project_code: project_code,
      };
      console.log('Sending message with ID', mResponse);

      await this.prisma.messages.update({
        where: {
          id: message_id,
        },
        data: {
          wa_message_id: data.messages[0].id,
        },
      });
    } catch (err: unknown) {
      if ((err as any).response) {
        return (err as AxiosError)?.response?.data;
      }
      if (err instanceof Error) {
        return (err as Error).message;
      }
      return err;
    }
  }
}
