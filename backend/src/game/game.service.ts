import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { User } from '../entities/user.entity';
import {Paddle, Ball, Computer} from './interface/game.interface';
import { Socket } from 'socket.io';
@Injectable()
export class GameService {
    private connected_users: Map<string,User> = new Map();
    private classic_queue: string[] = [];
    private custom_queue: string[] = [];
    private paddle: Paddle;
    private ball: Ball;
    private computer: Computer;
    constructor(private readonly authService: AuthService) {
        this.initializeGameEntities()
    };

    async set_online_user(client: Socket ,token: any){
		const _token = token;
		// console.log(token);
		// const user = await this.authService.user_by_token(_token);

        // this.connected_users.set(client.id,user);
        // console.log("from the set_online_methoed", user);
	}
    find_user_with_id(client_id: string){
		const user = this.connected_users.get(client_id);
		return user;
	}
    // init_table(client: Socket):number[]
    // {
    //     const width : number = 900;
    //     const height : number = 400;
    //     const table_size : number[] = [width,height];
    //     return table_size;
    // }
    private initializeGameEntities() {
        this.paddle = { x: 0, y: 0, width: 20, height: 100, score: 0 };
        this.computer = { x: 0, y: 0, width: 20, height: 100, score: 0 };
        this.ball = { x: 0, y: 0, radius: 10, speed: 1, dirx: 0, diry: 0};
      }
    
    init_table(canvasWidth: number, canvasHeight: number)
    {
        const PLAYER_WIDTH_PX = 20;  // Paddle width in pixels
        const PLAYER_HEIGHT_PX = 100; // Paddle height in pixels

        // const paddleWidth = (PLAYER_WIDTH_PX / canvasWidth) * 100;
        // const paddleHeight = (PLAYER_HEIGHT_PX / canvasHeight) * 100;

        this.paddle = {
            x: 0, y: canvasHeight / 2 - PLAYER_HEIGHT_PX / 2, width: PLAYER_WIDTH_PX, height: PLAYER_HEIGHT_PX, score: 0,
        }
        this.computer = {
            x: canvasWidth - PLAYER_WIDTH_PX, y: canvasHeight - PLAYER_HEIGHT_PX, width: PLAYER_WIDTH_PX, height: PLAYER_HEIGHT_PX, score: 0,
        }   
        return {
            paddleRe: this.paddle,
            compRe: this.computer,
        }
    }
}

