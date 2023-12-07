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
        this.initializeGameEntities()
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
                    console.log(player.logicGame);
                    this.startGame(logic);
                }
                // cleint.log(logic.getGameID());
                // console.log(player)

                // this.connected_users.set(client.id, {oo,logic_game});

            }
        }
    }
    private startGame(gameLogic: LogicGame)
    {
        const gameInterval = setInterval(() => {
            gameLogic.getObjectStatus();
            this.socketService.emitToRoom(gameLogic.getGameID(), 'game-data', gameLogic.getObjectStatus());
          }, 1000 / 60);
    }
    private initializeGameEntities() {
        this.paddle = { x: 0, y: 0, width: 20, height: 100, score: 0 };
        this.computer = { x: 0, y: 0, width: 20, height: 100, score: 0 };
        this.ball = { x: 0, y: 0, radius: 10, speed: 1, dirx: 0, diry: 0};
    }

    checkCollisionWithPaddle() {
        let selectedPaddle = this.ball.x < this.canvasWidth / 2 ? this.paddle : this.computer;
    
        // Define the edges of the ball and paddle
        let paddleTopEdge = selectedPaddle.y;
        let paddleBottomEdge = selectedPaddle.y + selectedPaddle.height;
        let paddleLeftEdge = selectedPaddle.x;
        let paddleRightEdge = selectedPaddle.x + selectedPaddle.width;
    
        let ballTopEdge = this.ball.y - this.ball.radius;
        let ballBottomEdge = this.ball.y + this.ball.radius;
        let ballLeftEdge = this.ball.x - this.ball.radius;
        let ballRightEdge = this.ball.x + this.ball.radius;
    
        // Check for collision
        if (ballRightEdge > paddleLeftEdge && ballLeftEdge < paddleRightEdge &&
            ballBottomEdge > paddleTopEdge && ballTopEdge < paddleBottomEdge) {
    
          // Determine which side the ball hit
          let hitTop = Math.abs(ballBottomEdge - paddleTopEdge);
          let hitBottom = Math.abs(ballTopEdge - paddleBottomEdge);
          let hitLeft = Math.abs(ballRightEdge - paddleLeftEdge);
          let hitRight = Math.abs(ballLeftEdge - paddleRightEdge);
    
          let minHit = Math.min(hitTop, hitBottom, hitLeft, hitRight);
    
          if (minHit === hitTop || minHit === hitBottom) {
            this.ball.diry = -this.ball.diry; // Reverse vertical direction
          } else {
            this.ball.dirx = -this.ball.dirx; // Reverse horizontal direction
          }
    
          return true; // Collision occurred
        }
        return false; // No collision
    }
    computerAI()
    {
        const paddleSpeedPerSecond = 450; 
        const middleOfPaddle = this.computer.y + this.computer.height / 2;
        
        if (this.ball.dirx > 0 && this.ball.x > this.canvasWidth / 2) {
            if (middleOfPaddle < this.ball.y) {
                this.computer.y += paddleSpeedPerSecond * this.deltaTime;
            } else if (middleOfPaddle > this.ball.y) {
                this.computer.y -= paddleSpeedPerSecond * this.deltaTime;
            }
        } 
        this.computer.y = Math.max(0, Math.min(this.computer.y, this.canvasHeight - this.computer.height));
    }
    updateGame(deltaTime: number)
    {
        if (this.ball.x - this.ball.radius < 0) {
            // Ball has passed the left edge, point for computer
            this.computer.score += 1;
            // Reset ball to the center
            this.ball.x = this.canvasWidth / 2;
            this.ball.y = this.canvasHeight / 2;
          } else if (this.ball.x + this.ball.radius > this.canvasWidth) {
            // Ball has passed the right edge, point for player
            this.paddle.score += 1;
            // Reset ball to the center
            this.ball.x = this.canvasWidth / 2;
            this.ball.y = this.canvasHeight / 2;
        }
        this.deltaTime = deltaTime;
        this.ball.x += this.ball.dirx;
        this.ball.y += this.ball.diry;
        if (
            this.ball.y + this.ball.radius > this.canvasHeight ||
            this.ball.y - this.ball.radius < 0
        ) {
            this.ball.diry = -this.ball.diry;
        }
        this.checkCollisionWithPaddle();
        this.computerAI();
    }
    movePlayerPaddle(direction: string) {
        const paddleSpeedPerSecond = 3000; 
        if (direction === 'up')
        {
            this.paddle.y -= paddleSpeedPerSecond * this.deltaTime;
        }
        else if (direction === 'down')
        {
            this.paddle.y += paddleSpeedPerSecond * this.deltaTime;
        }
        this.paddle.y = Math.max(
            0,
            Math.min(this.paddle.y, this.canvasHeight - this.paddle.height)
          );
    }
    setCanvasDimensions(width: number, height: number) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }
    getCurrentGameState() {
        return {
            paddleRe: this.paddle,
            compRe: this.computer,
            ball: this.ball,
        };
    }
    init_table()
    {
        const PLAYER_WIDTH_PX = 20;  // Paddle width in pixels
        const PLAYER_HEIGHT_PX = 100; // Paddle height in pixels

        // const paddleWidth = (PLAYER_WIDTH_PX / canvasWidth) * 100;
        // const paddleHeight = (PLAYER_HEIGHT_PX / canvasHeight) * 100;

        this.paddle = {
            x: 0, y: this.canvasHeight / 2 - PLAYER_HEIGHT_PX / 2, width: PLAYER_WIDTH_PX, height: PLAYER_HEIGHT_PX, score: 0,
        }
        this.computer = {
            x: this.canvasWidth - PLAYER_WIDTH_PX, y: this.canvasHeight / 2 - PLAYER_HEIGHT_PX / 2, width: PLAYER_WIDTH_PX, height: PLAYER_HEIGHT_PX, score: 0,
        }
        this.ball = {
            x: this.canvasWidth / 2, y: this.canvasHeight / 2, radius: 10, speed: 1, dirx: 5, diry: 5 
        }
    }
}

