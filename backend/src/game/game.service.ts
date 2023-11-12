import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { User } from '../entities/user.entity';
import { Socket } from 'socket.io';
@Injectable()
export class GameService {
    private connected_users: Map<string,User> = new Map();
    private classic_queue: string[] = [];
    private custom_queue: string[] = [];
    constructor(private readonly authService: AuthService) {}

    async set_online_user(client: Socket ,token: any){
		const _token = token;
		// console.log(token);
		const user = await this.authService.user_by_token(_token);

        this.connected_users.set(client.id,user);
        // console.log("from the set_online_methoed", user);
	}
    find_user_with_id(client_id: string){
		const user = this.connected_users.get(client_id);
		return user;
	}
    init_table(client: Socket):number[]
    {
        const width : number = 900;
        const height : number = 400;
        const table_size : number[] = [width,height];
        return table_size;
    }
}

