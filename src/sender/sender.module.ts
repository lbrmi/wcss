import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';
import { SenderController } from './sender.controller';
import { Transport, ClientsModule } from "@nestjs/microservices"
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [ConfigModule.forRoot(),
	// 	ClientsModule.register([
	// 	{
	// 		name: "ROBO_SERVICE",
	// 		transport: Transport.RMQ,
	// 		options: {
	// 			urls: [
	// 				process.env.RABBITMQURI,
	// 			],
	// 			queue: "send_message_feedback",
	// 			queueOptions: {
	// 				durable: true,
	// 			},
	// 		},
	// 	},
	// ]),
],
	controllers: [SenderController],
	providers: [SenderService],
	exports: []
})
export class SenderModule {}


