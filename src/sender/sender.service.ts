import { Injectable, Scope } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

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
  constructor() {} // @Inject("ROBO_SERVICE") private readonly client: ClientProxy

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
      await this.rabbitMq(mResponse, 'send_message_feedback');

      // this.client.send<number>("send_message_feedback", mResponse).subscribe()
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

  async rabbitMq(data: any, routingkey: string) {
    try {
      const amqplib = require('amqplib');
      // Connect to the RabbitMQ server
      const connection = await amqplib.connect(process.env.RABBITMQURI);

      // Create a channel
      const channel = await connection.createChannel();
      // Declare a topic exchange
      // await channel.assertExchange('amq.topic', 'topic', {
      //     passive: false,
      //     durable: true,
      //     auto_delete: false,
      //     internal: false,
      //     nowait: false,
      // });
      // Send the "hello world" message with the routing key "routing_a"
      channel.publish(
        'amq.topic',
        routingkey,
        Buffer.from(JSON.stringify(data)),
      );
      console.log(` [x] Sent data with routing key ${routingkey}`);
      await channel.close();
      await connection.close();
    } catch (err) {
      console.error(err);
    }
  }
}
