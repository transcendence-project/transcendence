import { Injectable } from '@nestjs/common';
import {objectStatusDto, PlayerDto, BallDto, PaddleDto} from '../dto/game.dto'

const Paddle_Width = 0.02
const Paddle_Height = 0.2
const Paddle_Speed = 0.0175
const Ball_Radius = 0.027
const Collision_Angle = 80
const Ball_XSpeed = 0.010
const Ball_YSpeed = 0.0
const Computer_Speed = 0.0075

@Injectable()
export class LogicGame {
    private objectGame: objectStatusDto
    private gameId: string
    private gameType: string
    private winner: string
    public leaver: string

    constructor(
        player1Login: string,
        Player2Login: string,
        gameType: string,
    ) {
        this.gameType = gameType
        this.gameId = this.generateGameId()
        this.winner = null
        if (gameType == 'classic')
        {
            const colorBall = "#19A7CE";
            const coloPaddle = "#9336B4";
            this.objectGame = this.instanciateGame(player1Login, Player2Login, colorBall, coloPaddle);
        }
        else
        {
            const colorBall = "white";
            const coloPaddle = "#7BD3EA";
            this.objectGame = this.instanciateGame(
                player1Login,
                Player2Login,
                colorBall,
                coloPaddle,
            )
        }
    }

    private instanciateGame(
        player1Login: string,
        Player2Login: string,
        ballColor : string,
        paddleColor : string,
    ): objectStatusDto {
        return {
            players: [
                this.createPlayer(player1Login, 1, paddleColor),
                this.createPlayer(Player2Login, 2, paddleColor),
            ],
            ball: {
                x: 0.5,
                y: 0.5,
                dx: Ball_XSpeed,
                dy: Math.random() > 0.5 ? Ball_YSpeed : -Ball_YSpeed,
                radius: Ball_Radius,
                color: ballColor,
            },
        }
    }

    public getObjectStatus(): objectStatusDto {
        return this.objectGame
    }

    public getPlayer1ID(): string {
        return this.objectGame.players[0].login
    }

    public getPlayer2ID(): string {
        return this.objectGame.players[1].login
    }

    public getGameID(): string {
        return this.gameId
    }

    private generateGameId(): string {
        return crypto.randomUUID()
    }

    private createPlayer(login: string, side: number, paddleColor: string): PlayerDto {
        return {
            login,
            score: 0,
            paddle: {
                x: side == 1 ? Paddle_Width / 2 : 1 - Paddle_Width / 2,
                y: 0.45,
                width: Paddle_Width,
                height: Paddle_Height,
                speed: Paddle_Speed,
                color: paddleColor,
            },
            gameID: this.gameId,
            ready: login == 'computer' ? true :  false,
        }
    }

    public checkWinner(): boolean {
        if (this.winner) return true
        const player1Score = this.objectGame.players[0].score
        const player2Score = this.objectGame.players[1].score
            if (player1Score === 7) {
                this.winner = this.objectGame.players[0].login
                return true
            }
            if (player2Score === 7) {
                this.winner = this.objectGame.players[1].login
                return true
            }
        return false
    }

    public getWinner(): PlayerDto {
        return this.objectGame.players.find(player => player.login === this.winner);
    }

    public updateComputer(): void {
        const computer = this.objectGame.players.find(player => player.login === 'computer')
        const ball = this.objectGame.ball
        const paddle = computer.paddle
        if (computer) {
            if (ball.dx < 0) return

            const distance = Math.abs(1 - ball.x)
            const timeToReachPaddle = distance / Math.abs(ball.dx)
            const predictedBallY = ball.y + ball.dy * timeToReachPaddle

            let targetY = predictedBallY

            targetY = Math.max(paddle.height / 2, Math.min(1 - paddle.height / 2, targetY))

            if (paddle.y < targetY) {
                paddle.y += Math.min(Computer_Speed, targetY - paddle.y)
            } else if (paddle.y > targetY) {
                paddle.y -= Math.min(Computer_Speed, paddle.y - targetY)
            }
        }
    }

    // update the game by updating the ball position and checking for collisions
    public updateGame(): void {
        this.updateBall()
        if (this.getPlayer2ID() === 'computer') this.updateComputer()
    }

    // update the ball position and check for collisions
    private updateBall(): void {
        this.moveBall(this.objectGame.ball)
        this.checkBallCollision(this.objectGame)
    }

    // move the ball to the next position
    private moveBall(ball: BallDto): void {
        // if (ball.dx > Ball_Radius) ball.dx = Ball_Radius - 0.001
        ball.x += ball.dx
        ball.y += ball.dy
    }
    
    public updatePaddlePosition(playerID: string, direction: string): void {
        const player = this.objectGame.players.find(player => player.login === playerID)

        if (direction === 'up') {
            player.paddle.y -= player.paddle.speed;
        } else if (direction === 'down') {
            player.paddle.y += player.paddle.speed;
        }

        player.paddle.y = Math.max(
            0,Math.min(player.paddle.y, 1 - player.paddle.height / 2),
        )
    }
    // reset the ball position that is out of bounds to the center
    private checkWallCollision(ball: BallDto): void {
        if ((ball.y <= ball.radius) || (ball.y >= 1 - ball.radius)) {
            ball.dy *= -1
        }
    }

    // check if the ball collided with a player paddle
    private checkPlayerCollision(ball: BallDto, paddle: PaddleDto, playerIndex: number): boolean {
        const paddleLeft = playerIndex === 0 ? paddle.x : paddle.x - paddle.width
        const paddleRight = playerIndex === 0 ? paddle.x + paddle.width : paddle.x
        const paddleTop = paddle.y
        const paddleBottom = paddle.y + paddle.height
        return (
            ball.y + ball.radius >= paddleTop &&
            ball.y - ball.radius <= paddleBottom &&
            ball.x + ball.radius >= paddleLeft &&
            ball.x - ball.radius <= paddleRight
        )
    }
    // check if the ball collided with wall or paddle and update the score if it is out of bounds
    private checkBallCollision(game: objectStatusDto): void {
        const { ball, players } = game

        this.checkWallCollision(ball)
        if (ball.x <= players[0].paddle.x + players[0].paddle.width) {
            if (this.checkPlayerCollision(ball, players[0].paddle, 0)) {
                this.reflectBall(ball, players[0].paddle)
            } else if (ball.x < 0) {
                players[1].score += 1
                this.resetBallPosition(ball)
            }
        }
        else if (ball.x >= players[1].paddle.x - players[1].paddle.width) {
            if (this.checkPlayerCollision(ball, players[1].paddle, 1)) {
                this.reflectBall(ball, players[1].paddle)
            } else if (ball.x > 1) {
                players[0].score += 1
                this.resetBallPosition(ball)
            }
        }
    }

    private reflectBall(ball: BallDto, paddle: PaddleDto): void {
        ball.dx *= -1
        const relativePos = ball.y - paddle.y
        const paddleHitPoint = relativePos / (paddle.height / 2 + ball.radius)
        const angle = paddleHitPoint * Collision_Angle
        const ballSpeed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2)
        ball.dy = ballSpeed * Math.sin(angle * (Math.PI / 180))
    }
    
    // reset the ball position to the center
    private resetBallPosition(ball: BallDto): void {
        ball.x = 0.5
        ball.y = 0.5
        ball.dx = 0
        ball.dy = 0

        setTimeout(() => {
            ball.dx = Math.random() > 0.5 ? Ball_XSpeed : -Ball_XSpeed
            ball.dy = Math.random() > 0.5 ? Ball_YSpeed : -Ball_YSpeed
        }, 1500)
    }
}