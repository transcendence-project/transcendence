import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { User } from '../entities/user.entity';
import { LogicGame } from './logic/LogicGame'
import {Paddle, Ball, Computer, } from './interface/game.interface';
import {GameSelectDto} from './dto/game.dto'
import { Socket } from 'socket.io';
import { SocketService } from './socket.service'
import { UsersService } from 'users/users.service';
import { use } from 'passport';
import { emit } from 'process';

@Injectable()
export class GameService {
    // private connected_users:Map<string,User> = new Map();
    private connected_users: Map<Socket, { user: User, logicGame: LogicGame | null , status: string, pendingInvitations: string}> = new Map();
    private classic_queue: string[] = [];
    private custom_queue: string[] = [];

    constructor(private readonly authService: AuthService, private socketService: SocketService, private userService: UsersService) {
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
        let flag = 0;
            const user = await this.authService.user_by_token(_token);
            // console.log(this.connected_users.has(user.userName));
            if (this.connected_users != undefined)
            {
                this.connected_users.forEach((value, key, map) =>{
                    if (value && value.user && user.userName === value.user.userName)
                    {
                        client.emit('multi-login');
                        client.disconnect(true);
                         flag = 1;
                    }
                });

            }
            if (flag == 0)
            {
                this.connected_users.set(client,{user, logicGame: null, status: 'online', pendingInvitations: null});
                this.socketService.emitToServer('user-status', 'online');
            }
            
	}

    find_user_with_id(client_id: Socket){
		const user = this.connected_users.get(client_id);
		return user;
	}

    // public getKeyByValue(map: Map<Socket,{ user: User, logicGame: LogicGame | null }>, searchValue) {
    //     const foundEntry = Array.from(map.entries()).find(([key, value]) => value.user.userName === searchValue);
    //     return foundEntry ? foundEntry[0] : null;
    // }
    public getKeyByValue(map: Map<Socket, { user: User, logicGame: LogicGame | null, pendingInvitations: string }>, searchValue: string): Socket | null {
        for (const [key, value] of map.entries()) {
            if (value && value.user && value.user.userName === searchValue) {
                return key;
            }
        }
        return null;
    }

    public getUserStatus(client: Socket, userLogin: string)
    {
        const userKey = this.getKeyByValue(this.connected_users, userLogin);
        const user = this.connected_users.get(userKey);

        // console.log("this is the user from get function ", user)
        if (user)
        {
            if (user.status === 'online')
                client.emit('user-status', user.status);
            else if (user.status === 'busy')
                client.emit('user-status', user.status);

        }
        else
            client.emit('user-status', 'offline');
    }

    public creatSingleGame(client: Socket, gameInfo: GameSelectDto)
    {
        const player = this.connected_users.get(client);
        console.log("this is the player",player)
        let logic: LogicGame;
        if (player)
        {
            // console.log("inside the player")
            if (gameInfo.gameType === 'classic')
            {
                if (player.logicGame == null)
                {

                    logic = new LogicGame(player.user.userName, 'computer', gameInfo.gameType);

                    player.logicGame = logic;
                    player.status = 'ingame';
                    this.socketService.emitToServer('user-status', 'ingame');
                    client.join(logic.getGameID());
                    this.countDown(logic, player, null);
                    this.startGame(logic);
                }
            }
            else
            {
                if (player.logicGame == null)
                {
                    logic = new LogicGame(player.user.userName, 'computer', gameInfo.gameType);
                    player.logicGame = logic;
                    player.status = 'ingame';
                    client.join(logic.getGameID());
                    this.countDown(logic, player, null);
                    this.startGame(logic);
                }
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
            // player.status = 'ingame';
            // opponent.status = 'ingame';
            console.log("inside the oppent ", player.user.userName);
            // player.status = 'ingame'
            // opponent.status = 'ingame'
        }
    }

    private createMultiGame(player1: { user: User, logicGame: LogicGame, status: string, pendingInvitations: string}, 
                            player2: { user: User, logicGame: LogicGame, status: string, pendingInvitations: string},
                            gameType: string, gameMode?: string,) 
    {
        let logic : LogicGame;
        const player1Key = this.getKeyByValue(this.connected_users, player1.user.userName);
        const player2Key = this.getKeyByValue(this.connected_users, player2.user.userName);

            if (player1 && player2)
            {
                if (gameType === 'classic')
                {
                    if (player1.logicGame == null && player2.logicGame == null)
                    {
                        logic = new LogicGame(player1.user.userName, player2.user.userName, gameType);
                        player1.logicGame = logic;
                        player2.logicGame = logic;
                        player1Key.join(logic.getGameID());
                        player2Key.join(logic.getGameID());
                        player1.status = 'ingame';
                        player2.status = 'ingame';
                        this.socketService.emitToServer('user-status', 'ingame');
                        this.countDown(logic, player1, player2);
                        this.startGame(logic);
                    }
                }
                else 
                {
                    if (player1.logicGame == null && player1.logicGame == null)
                    {
                        logic = new LogicGame(player1.user.userName, player2.user.userName, gameType);
                        player1.logicGame = logic;
                        player2.logicGame = logic;
                        player1Key.join(logic.getGameID());
                        player2Key.join(logic.getGameID());
                        player1.status = 'ingame';
                        player2.status = 'ingame';
                        this.socketService.emitToServer('user-status', 'ingame');
                        this.countDown(logic, player1, player2);
                        this.startGame(logic);
                    }
                }  
            }
        // }




    }

    private async findOpponent(userLogin: string, gameType: string): Promise<{ user: User, logicGame: LogicGame | null, status: string, pendingInvitations: string} | null> {
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
        let player1Key: Socket;
        let player2Key: Socket;

        if (player1)
        {
             player1Key = this.getKeyByValue(this.connected_users, player1.user.userName);
        }
        if (player2)
        {
            player2Key = this.getKeyByValue(this.connected_users, player2.user.userName);
        }

        const countdownInterval = setInterval(() => {
            if (countdown >= 0) {
                if (player1Key)
                    player1Key.emit('game-count', countdown);
                if (player2Key)
                    player2Key.emit('game-count', countdown);
                countdown--;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    private async startGame(gameLogic: LogicGame)
    {
        const gameInterval = setInterval(async () => {
            gameLogic.updateGame();
            this.socketService.emitToRoom(gameLogic.getGameID(), 'game-data', gameLogic.getObjectStatus());
            if (gameLogic.checkWinner())
            {
                clearInterval(gameInterval);
                await this.endGame(gameLogic);
                return;
            }
        }, 1000 / 60);
    }

    public async endGame(gameLogic: LogicGame)
    {
        const getKeyPlayer1 = this.getKeyByValue(this.connected_users, gameLogic.getPlayer1ID());
        const player1 = this.connected_users.get(getKeyPlayer1);
        const getKeyPlayer2 = this.getKeyByValue(this.connected_users, gameLogic.getPlayer2ID());
        const player2 = this.connected_users.get(getKeyPlayer2);
        const winner = gameLogic.getWinner();
        
        if (gameLogic.getPlayer2ID() === 'computer')
        {
            this.clearData(gameLogic);
            return;    
        }

        if (player1 && player2 && gameLogic.getPlayer2ID() !== 'computer')
        {
            if (player1.user.userName === winner.login && player1.status === 'ingame') 
            {
                const loser = gameLogic.getPlayer2Info();
                // console.log("f the winner is : ", winner, player1.user.id);
                // console.log("the loser is : ", loser, player2.user.id);
                // console.log("the winner is score : ", winner.score);
                // console.log("the loser is score : ", loser.score); 
                // console.log("here before the saveMatch player1 status is ", player1.status);
                // player1.status = 'online';
                // console.log("first condition here the player status change should call one time", player1.status);
                if (player1.status === 'ingame')
                {
                    console.log("inside the first condition ", player1.status);
                    await this.userService.saveMatch(player1.user.id, winner.score, player2.user.id, loser.score);
                    // this.socketService.emitToRoom(gameLogic.getGameID(), 'game-over',gameLogic.getWinner());
                }
            }
            else
            {
                const loser = gameLogic.getPlayer1Info();
                console.log("t the winner is : ", winner, player2.user.id);
                console.log("the loser is : ", loser, player1.user.id);
                console.log("the winner is score : ", winner.score);
                console.log("the loser is score : ", loser.score);
                if (player1.status === 'ingame')
                {
                    console.log("here before the saveMatch player2 status is ", player1.status, "this is the player2 status ", player2.status);
                    // player1.status = 'online';
                    await this.userService.saveMatch(player2.user.id, winner.score, player1.user.id, loser.score);
                }
            }
            this.clearData(gameLogic)
        }
    }

    private clearData(game: LogicGame) {
        // const player1 = this.connected_users.find(user => user.login == game.getPlayer1ID())
        this.socketService.emitToRoom(game.getGameID(), 'game-over',game.getWinner());
        const getKeyPlayer1 = this.getKeyByValue(this.connected_users, game.getPlayer1ID());
        const player1 = this.connected_users.get(getKeyPlayer1);
        if (player1) {
            player1.logicGame = null;
            player1.pendingInvitations = null;
            player1.status = 'online';
            this.socketService.emitToServer('user-status', 'online');
            getKeyPlayer1.leave(game.getGameID());
        }
        // const player2 = this.connected_users.find(user => user.login == game.getPlayer2ID())
        const getKeyPlayer2 = this.getKeyByValue(this.connected_users, game.getPlayer2ID());
        const player2 = this.connected_users.get(getKeyPlayer2);
        if (player2) {
            player2.logicGame = null;
            player2.pendingInvitations = null;
            player2.status = 'online';
            this.socketService.emitToServer('user-status', 'online');
            getKeyPlayer2.leave(game.getGameID())
        }
    }
    movePlayerPaddle(cleint: Socket, direction: string) {
        // const getKeyPlayer1 = this.getKeyByValue(this.connected_users, );
        const player = this.connected_users.get(cleint);
        console.log(player.user.userName);
        player.logicGame.updatePaddlePosition(player.user.userName, direction);
    }

    public  removePlayer(socket: Socket, deleteUser: number)
    {
        const player = this.connected_users.get(socket);
        // console.log("this is the player who left the page ", player.user.userName," and this is the logic for him ", player.logicGame, "and this is the number ", deleteUser)
        if (player)
        {
            if (player.status === 'inqueue')
            {
                if (this.classic_queue.includes(player.user.userName))
                    this.classic_queue.splice(this.classic_queue.indexOf(player.user.userName), 1);
                if (this.custom_queue.includes(player.user.userName))
                    this.custom_queue.splice(this.custom_queue.indexOf(player.user.userName), 1);
            }
            else if (player.status === 'ingame')
            {
                if (player.logicGame)
                {
                    player.logicGame.setLoser(player.user.userName);
                    // player.logicGame.leaver = player.user.userName;
                    // this.endGame(player.logicGame);
                }
            }
            if (deleteUser === 1)
            {
                this.socketService.emitToServer('user-status', 'offline');
                this.connected_users.delete(socket); 
                console.log("the player is removed from the user connected");
            }
        }
    }

    public removePlayerFromQueue(socket: Socket) {
        const player = this.connected_users.get(socket);
        if (player.status === 'inqueue')
        {
            if (this.classic_queue.includes(player.user.userName))
                this.classic_queue.splice(this.classic_queue.indexOf(player.user.userName), 1);
            if (this.custom_queue.includes(player.user.userName))
                this.custom_queue.splice(this.custom_queue.indexOf(player.user.userName), 1);
        }
    }

    public responeInvite(Ininviter: Socket, loginInvited: string)
    {
        const invitedKey = this.getKeyByValue(this.connected_users, loginInvited);
        if (invitedKey)
        {
            const invited = this.connected_users.get(invitedKey);
            const inviter = this.connected_users.get(Ininviter);

            if (invited.status !== 'busy' && inviter.status !== 'busy')
            {
                invited.status = 'busy';
                inviter.status = 'busy';
                inviter.pendingInvitations = loginInvited;
                invited.pendingInvitations = inviter.user.userName;
                console.log("here before the invite-sttaus");
                invitedKey.emit('invite-status' , inviter.user.userName);
            }
            else if (invited.status !== 'busy')
                invitedKey.emit('busy-invite',inviter.user.userName);
            else
                Ininviter.emit('busy-invite', invited.user.userName);
        }
        else 
        {
            // the user does not connect
            Ininviter.emit('offline-status', loginInvited);
        }
    }

    public responeInviteStatus(Ininvited: Socket, status: Boolean)
    {
        if (status)
        {
            const invited = this.connected_users.get(Ininvited);
            const inviterLoginKey = this.getKeyByValue(this.connected_users, invited.pendingInvitations);
            const inviter = this.connected_users.get(inviterLoginKey);

            Ininvited.emit('route-to-game');
            inviterLoginKey.emit('route-to-game');
            this.createMultiGame(inviter, invited, 'classic');
        }
        else
        {
            const invited = this.connected_users.get(Ininvited);
            if (invited.pendingInvitations)
            {
                const inviterLoginKey = this.getKeyByValue(this.connected_users, invited.pendingInvitations);
                const inviter = this.connected_users.get(inviterLoginKey);
                if (invited && inviter)   // i will remove this when the UserProfile page finish 
                {
                    if (invited.status === 'busy' || inviter.status === 'busy')
                    {
                        invited.status = null;
                        inviter.status = null;
                    }
                }
            }

        }
    }
}

