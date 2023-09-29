import { Controller, Inject } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices"
import { SenderService } from './sender.service';


@Controller('sender')
export class SenderController {

    constructor(private readonly sender:SenderService){}

    @MessagePattern("send_message")
	async getNotifications(@Payload() data :any, @Ctx() context: RmqContext) {
		try {
			this.sender.send(data)
		}
		catch (e) {
			console.log('RMQ Message Receiving error', e.message);
           
		}
		// console.log(`Pattern: ${context.getPattern()}`)
		// const d = JSON.stringify(data)
		// console.log(`data: ${d}`)
	}

}
