import { Injectable } from '@nestjs/common';
import { Channel } from '../chat/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// for now mainly to save in the repository because injecting repo in gateway isn't workin for some reason

@Injectable()
export class WebsocketService {
	constructor(@InjectRepository(Channel) private roomRepo: Repository<Channel>){}

	async connect_user(){
		// store it in database base
	}

	async disconnect_user(){
		// delete from databse
	}

}
