import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { User } from '../entities/user.entity';
import { LogicGame } from './logic/LogicGame'
import {Paddle, Ball, Computer, } from './interface/game.interface';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service'

@Injectable()
export class GameService {
    // private connected_users:Map<string,User> = new Map();
    private connected_users: Map<string, { user: User, logicGame: LogicGame | null }> = new Map();
    private classic_queue: string[] = [];
    private custom_queue: string[] = [];
    private paddle: Paddle;
    private ball: Ball;
    private computer: Computer;
    private canvasWidth: number;
    private canvasHeight: number;
    private deltaTime: number;

    constructor(private readonly authService: AuthService, private socketService: SocketService,) {
    };

    public async addConnectUser(client : Socket, token: any)
    {
        console.log("before",this.connected_users);
        await this.set_online_user(client, token);
        const oo = this.find_user_with_id(client.id);
        console.log("after",this.connected_users);
        // console.log(oo);
    }
    async set_online_user(client: Socket ,token: any){
		const _token = token;
        // let flag = 0;
            const user = await this.authService.user_by_token(_token);
            // console.log(this.connected_users.has(user.userName));
            // if (this.connected_users != undefined)
            // {
            //     this.connected_users.forEach((value, key, map) =>{
            //         if (user.userName === value.user.userName)
            //         {
            //             console.log("ehre");
            //             this.connected_users.delete(client.id);
            //             client.disconnect(true);
            //              flag = 1;
            //             // console.log(key, value.userName);
            //         }
            //     });

            // }
            // console.log(this.connected_users.);
            // if (this.connected_users.has(user.userName))
            // {
            //     console.log('this user try to connecte again ' ,user);
            //     client.disconnect(true);
            //     return; 
            // }
            // if (flag == 0)
                this.connected_users.set(client.id,{user, logicGame: null});
            
	}
    find_user_with_id(client_id: string){
		const user = this.connected_users.get(client_id);
		return user;
	}
    public creatSingleGame(client: Socket, gameInfo: any)
    {
        const player = this.connected_users.get(client.id);
        // const oo = this.connected_users.has(client.id);
        if (player)
        {
            let logic: LogicGame;
            if (gameInfo.type === 'classic')
            {
                if (player.logicGame == null)
                {
                    logic = new LogicGame(player.user.userName, 'computer,', gameInfo.type);
                    player.logicGame = logic;
                    client.join(logic.getGameID());
                    this.countDown(logic);
                    this.startGame(logic);
                }
                // cleint.log(logic.getGameID());
                // console.log(player)

                // this.connected_users.set(client.id, {oo,logic_game});

            }
        }
    }
    
    private countDown(gameLogic: LogicGame)
    {
        let countdown = 3;
        const countdownInterval = setInterval(() => {
            if (countdown >= 0) {
                this.socketService.emitToRoom(gameLogic.getGameID(), 'game-count', countdown);
                // if (player2Socket) {
                //     this.socketService.emitToPlayer(player2Socket, 'countdown', countdown);
                // }
                countdown--;
            } else {
                clearInterval(countdownInterval);
                // Start the actual game
                // this.startGame(game, p1, p2);
            }
        }, 1000);
    }

    private startGame(gameLogic: LogicGame)
    {
        // let lastUpdateTime = Date.now();
        const gameInterval = setInterval(() => {
            // const now = Date.now();
            // const deltaTime = (now - lastUpdateTime) / 1000; 
            gameLogic.updateGame();
            // lastUpdateTime = now;
            this.socketService.emitToRoom(gameLogic.getGameID(), 'game-data', gameLogic.getObjectStatus());
          }, 1000 / 50);
    }

    movePlayerPaddle(cleint: Socket, direction: string) {
        const player = this.connected_users.get(cleint.id);
        player.logicGame.updatePaddlePosition(player.user.userName, direction);
    }

}

