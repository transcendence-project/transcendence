import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { User } from '../entities/user.entity';
import { LogicGame } from './logic/LogicGame'
import {Paddle, Ball, Computer, } from './interface/game.interface';
import {GameSelectDto} from './dto/game.dto'
import { Socket } from 'socket.io';
import { SocketService } from './socket.service'

@Injectable()
export class GameService {
    // private connected_users:Map<string,User> = new Map();
    private connected_users: Map<Socket, { user: User, logicGame: LogicGame | null , status: string}> = new Map();
    public classic_queue: string[] = [];
    public custom_queue: string[] = [];
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
        // console.log("before",this.connected_users);
        await this.set_online_user(client, token);
        const oo = this.find_user_with_id(client);
        // console.log("after",this.connected_users);
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
                this.connected_users.set(client,{user, logicGame: null, status: 'online'});
            
	}

    find_user_with_id(client_id: Socket){
		const user = this.connected_users.get(client_id);
		return user;
	}
    public getKeyByValue(map: Map<Socket,{ user: User, logicGame: LogicGame | null }>, searchValue) {
        const foundEntry = Array.from(map.entries()).find(([key, value]) => value.user.userName === searchValue);
        return foundEntry ? foundEntry[0] : null;
    }
    
    public creatSingleGame(client: Socket, gameInfo: GameSelectDto)
    {
        console.log("From the single game");    
        const player = this.connected_users.get(client);
        console.log("this is the player",player)
        let logic: LogicGame;
        if (player)
        {
            console.log("inside the player")
            if (gameInfo.gameType === 'classic')
            {
                if (player.logicGame == null)
                {

                    logic = new LogicGame(player.user.userName, 'computer', gameInfo.gameType);
                    player.logicGame = logic;

                    client.join(logic.getGameID());
                    console.log("fter join them to room");
                    this.countDown(logic, player, null);
                    this.startGame(logic);
                }
            }
            else
            {
                logic = new LogicGame(player.user.userName, 'computer', gameInfo.gameType);
                player.logicGame = logic;
            }
        }
    }
    
    public async onlineGame(userSocket: Socket, gameInfo: GameSelectDto) {
        const player = this.connected_users.get(userSocket);
        if (this.classic_queue.includes(player.user.userName) || this.custom_queue.includes(player.user.userName))
            return
        player.status = 'inqueue';
        const opponent = await this.findOpponent(player.user.userName, gameInfo.gameType);
        console.log("after the opponet function");

        if (opponent) {
            this.createMultiGame(player, opponent, gameInfo.gameType);
            player.status = 'ingame';
            opponent.status = 'ingame';
            console.log("inside the oppent ", player.user.userName);
            // player.status = 'ingame'
            // opponent.status = 'ingame'
        }
    }

    private createMultiGame(player1: { user: User, logicGame: LogicGame,status: string}, player2: { user: User, logicGame: LogicGame, status: string},
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
        const player2Key = this.getKeyByValue(this.connected_users, player2.user.userName);

        player1Key.join(logic.getGameID());
        player2Key.join(logic.getGameID());

        // this.repo.updatePlayerStatus('INGAME', player1.login)
        // this.repo.updatePlayerStatus('INGAME', player2.login)
        // player1.status = 'ingame'
        // player2.status = 'ingame'
        // this.initiateGame(game, player1, player2)
        this.countDown(logic, player1, player2);
        this.startGame(logic);
    }

    private async findOpponent(userLogin: string, gameType: string): Promise<{ user: User, logicGame: LogicGame | null, status: string } | null> {
        if (gameType == 'classic') {
            if (this.classic_queue.length > 0) {
                console.log("this is inside the oppent function before the shift", this.classic_queue);
                const opponent = this.classic_queue.shift();
                console.log("this is inside the oppent function after the shift", this.classic_queue);
                // console.log("this is inside the oppent function before the shift");
                const getKey = this.getKeyByValue(this.connected_users, opponent);
                console.log("this is the key", getKey);
                const player2 = this.connected_users.get(getKey);
                console.log("this is the userName for the key", player2.user.userName)
                return player2;
            } else {
                this.classic_queue.push(userLogin)
                return null
            }
        } else if (gameType == 'custom') {
            if (this.custom_queue.length > 0) {
                const opponent = this.custom_queue.shift();
                const getKey = this.getKeyByValue(this.connected_users, opponent);
                const player2 = this.connected_users.get(getKey);
                return player2;
            } else {
                this.custom_queue.push(userLogin)
                return null
            }
        }
    }

    private countDown(gameLogic: LogicGame, player1: { user: User, logicGame: LogicGame}, 
                        player2: { user: User, logicGame: LogicGame})
    {
        let countdown = 3;
        const player1Key = this.getKeyByValue(this.connected_users, player1.user.userName);
        const player2Key = this.getKeyByValue(this.connected_users, player2.user.userName);

        console.log("this is player one login ", player1.logicGame);
        console.log("this is player two login ", player2.logicGame);
        // console.log("this is player two login ", player2.user.userName);
        const countdownInterval = setInterval(() => {
            if (countdown >= 0) {
                player1Key.emit('game-count', countdown);
                player2Key.emit('game-count', countdown);
                // this.socketService.emitToRoom(gameLogic.getGameID(), 'game-count', countdown);
                countdown--;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    private startGame(gameLogic: LogicGame)
    {
        console.log("Start Game function");
        // let lastUpdateTime = Date.now();
        const gameInterval = setInterval(() => {
            // const now = Date.now();
            // const deltaTime = (now - lastUpdateTime) / 1000; 
            gameLogic.updateGame();
            // lastUpdateTime = now;
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
            console.debug("this is from the endGame player1", this.classic_queue);
            // this.classic_queue.pop();
            getKeyPlayer1.leave(gameLogic.getGameID());
        }
        
        if (player2 && gameLogic.getPlayer2ID() !== 'computer')
        {
            player2.logicGame = null;
            console.debug("this is from the endGame player2", this.classic_queue);
            getKeyPlayer2.leave(gameLogic.getGameID());
        }
    }

    movePlayerPaddle(cleint: Socket, direction: string) {
        // const getKeyPlayer1 = this.getKeyByValue(this.connected_users, );
        const player = this.connected_users.get(cleint);
        console.log(player.user.userName);
        player.logicGame.updatePaddlePosition(player.user.userName, direction);
    }

    public removeFromQueue(socket: Socket)
    {
        const player = this.connected_users.get(socket);
        console.log("from the gateway", player.logicGame);
        if (player)
        {
            if (player.status == 'inqueue')
            {
                if (this.classic_queue.includes(player.user.userName))
                    this.classic_queue.splice(this.classic_queue.indexOf(player.user.userName), 1);
                if (this.custom_queue.includes(player.user.userName))
                    this.custom_queue.splice(this.custom_queue.indexOf(player.user.userName), 1);
            }
            // else if (player.status == 'ingame')
            // {
            // }
        }
    }

    // public giveUp(socket: Socket) {
    //     // const player = this.connected_users.find(user => user.socket == userSocket)
    //     const player = this.connected_users.get(socket);
    //     if (player && player.status == 'ingame') {
    //         // player.logicGame.setLoser(player.login)
    //         player.game.leaver = player.login
    //     }
    // }
}

