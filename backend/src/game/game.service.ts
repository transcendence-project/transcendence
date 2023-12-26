import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { User } from '../entities/user.entity';
import { LogicGame } from './logic/LogicGame'
import {Paddle, Ball, Computer, } from './interface/game.interface';
import {GameSelectDto} from './dto/game.dto'
import { Socket } from 'socket.io';
import { SocketService } from './socket.service'
import { Client } from 'socket.io/dist/client';

@Injectable()
export class GameService {
    // private connected_users:Map<string,User> = new Map();
    private connected_users: Map<Socket, { user: User, logicGame: LogicGame | null }> = new Map();
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
        const oo = this.find_user_with_id(client);
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
                this.connected_users.set(client,{user, logicGame: null});
            
	}

    find_user_with_id(client_id: Socket){
		const user = this.connected_users.get(client_id);
		return user;
	}
    public getKeyByValue(map: Map<Socket,{ user: User, logicGame: LogicGame | null }>, searchValue) {
        const foundEntry = Array.from(map.entries()).find(([key, value]) => value.user.userName === searchValue);
        return foundEntry ? foundEntry[0] : null;
    }
    
    public creatSingleGame(client: Socket, gameInfo: any)
    {
        const player = this.connected_users.get(client);
        let logic: LogicGame;
        if (player)
        {
            if (gameInfo.type === 'classic')
            {
                if (player.logicGame == null)
                {
                    logic = new LogicGame(player.user.userName, 'computer', gameInfo.type);
                    player.logicGame = logic;
                    // console.debug("this is the Users",player);
                    client.join(logic.getGameID());
                    this.countDown(logic);
                    this.startGame(logic);
                }
            }
            else
            {
                logic = new LogicGame(player.user.userName, 'computer', gameInfo.type);
                player.logicGame = logic;
            }
        }
    }
    
    public async onlineGame(userSocket: Socket, gameInfo: GameSelectDto) {
        const player = this.connected_users.get(userSocket);
        if (this.classic_queue.includes(player.user.userName) || this.custom_queue.includes(player.user.userName))
            return
        const opponent = await this.findOpponent(player.user.userName, gameInfo.gameType);

        if (opponent) {
            this.createMultiGame(player, opponent, gameInfo.gameType)
            // player.status = 'ingame'
            // opponent.status = 'ingame'
        }
    }
    private createMultiGame(player1: { user: User, logicGame: LogicGame}, player2: { user: User, logicGame: LogicGame},
                            gameType: string, gameMode?: string,) 
    {
        let logic
        // if (gameType == 'custom') {
        //     game = new PongGame(
        //         player1.login,
        //         player2.login,
        //         gameType,
        //         player1.powerUps,
        //         player2.powerUps,
        //     )
        // } else {
            logic = new LogicGame(player1.user.userName, player2.user.userName, gameType)
        // }

        player1.logicGame = logic
        player2.logicGame = logic
        const player1Key = this.getKeyByValue(this.connected_users, player1.user.userName);
        const player2Key = this.getKeyByValue(this.connected_users, player1.user.userName);

        player1Key.join(logic.getGameID());
        player2Key.join(logic.getGameID());

        // this.repo.updatePlayerStatus('INGAME', player1.login)
        // this.repo.updatePlayerStatus('INGAME', player2.login)
        // player1.status = 'ingame'
        // player2.status = 'ingame'
        // this.initiateGame(game, player1, player2)
        this.countDown(logic);
        this.startGame(logic);
    }
    private async findOpponent(userLogin: string, gameType: string): Promise<{ user: User, logicGame: LogicGame | null } | null> {
        if (gameType == 'classic') {
            if (this.classic_queue.length > 0) {
                const opponent = this.classic_queue.shift();
                const getKey = this.getKeyByValue(this.connected_users, opponent);
                const player2 = this.connected_users.get(getKey);
                return player2;
            } else {
                this.classic_queue.push(userLogin)
                return null
            }
        } else if (gameType == 'custom') {
            if (this.custom_queue.length > 0) {
                const opponent = this.classic_queue.shift();
                const getKey = this.getKeyByValue(this.connected_users, opponent);
                const player2 = this.connected_users.get(getKey);
                return player2;
            } else {
                this.custom_queue.push(userLogin)
                return null
            }
        }
    }

    private countDown(gameLogic: LogicGame)
    {
        let countdown = 3;
        const countdownInterval = setInterval(() => {
            if (countdown >= 0) {
                this.socketService.emitToRoom(gameLogic.getGameID(), 'game-count', countdown);
                countdown--;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    private startGame(gameLogic: LogicGame)
    {
        const gameInterval = setInterval(() => {
            gameLogic.updateGame();
            this.socketService.emitToRoom(gameLogic.getGameID(), 'game-data', gameLogic.getObjectStatus());
            if (gameLogic.checkWinner())
            {
                clearInterval(gameInterval);
                this.endGame(gameLogic)
                return;
            }
        }, 1000 / 60);
    }

    public endGame(gameLogic: LogicGame)
    {
        this.socketService.emitToRoom(gameLogic.getGameID(), 'game-over',gameLogic.getWinner());
        const getKeyPlayer1 = this.getKeyByValue(this.connected_users, gameLogic.getPlayer1ID());
        const player1 = this.connected_users.get(getKeyPlayer1);
        const getKeyPlayer2 = this.getKeyByValue(this.connected_users, gameLogic.getPlayer2ID());
        const player2 = this.connected_users.get(getKeyPlayer2);

        if (player1)
        {
            player1.logicGame = null;
            getKeyPlayer1.leave(gameLogic.getGameID());
        }

        if (player2 && gameLogic.getPlayer2ID() !== 'computer')
        {
            player2.logicGame = null;
            getKeyPlayer2.leave(gameLogic.getGameID());
        }
    }

    movePlayerPaddle(cleint: Socket, direction: string) {
        // const getKeyPlayer1 = this.getKeyByValue(this.connected_users, );
        const player = this.connected_users.get(cleint);
        console.log(player.user.userName);
        player.logicGame.updatePaddlePosition(player.user.userName, direction);
    }
}

