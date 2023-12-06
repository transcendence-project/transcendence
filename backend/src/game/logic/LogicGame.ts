import { Injectable } from '@nestjs/common';
import {objectStatusDto, PlayerDto} from '../dto/game.dto'

const Paddle_Width = 0.02
const Paddle_Height = 0.2
const Paddle_Speed = 0.0175
const Ball_Radius = 0.03
const Collision_Angle = 80
const Ball_XSpeed = 0.0165
const Ball_YSpeed = 0.0
const Computer_Speed = 0.0075

@Injectable()
export class LogicGame {
    private objectGame: objectStatusDto
    private gameId: string
    private gameType: string
    private winner: string
    public leaver: string
    // public events: EventEmitter
    // public analyzePlayer = new Map<string, gameAnalyzer>()
    // public isDeuce = false
    constructor(
        player1Login: string,
        Player2Login: string,
        gameType: string,
    ) {
        this.gameType = gameType
        this.gameId = this.generateGameId()
        this.winner = null
        if (gameType == 'classic')
            this.objectGame = this.instanciateGame(player1Login, Player2Login)
        else
            this.objectGame = this.instanciateGame(
                player1Login,
                Player2Login,
            )
    }

    private instanciateGame(
        player1Login: string,
        Player2Login: string,
    ): objectStatusDto {
        return {
            players: [
                this.createPlayer(player1Login, 1),
                this.createPlayer(Player2Login, 2),
            ],
            ball: {
                x: 0.5,
                y: 0.5,
                dx: Ball_XSpeed,
                dy: Math.random() > 0.5 ? Ball_YSpeed : -Ball_YSpeed,
                radius: Ball_Radius,
                color: 'white',
            },
            // time: 120,
            // countDown: 3,
        }
    }

    public getObjectStatus(): objectStatusDto {
        return this.objectGame
    }

    // public getPlayer1ID(): string {
    //     return this.game_status.players[0].login
    // }

    // public getPlayer2ID(): string {
    //     return this.game_status.players[1].login
    // }

    public getGameID(): string {
        return this.gameId
    }

    // public getGameType(): string {
    //     return this.gameType
    // }

    // public getPlayer1Score(): number {
    //     return this.game_status.players[0].score
    // }

    // public getPlayer2Score(): number {
    //     return this.game_status.players[1].score
    // }

    private generateGameId(): string {
        return crypto.randomUUID()
    }

    private createPlayer(login: string, side: number): PlayerDto {
        return {
            login,
            score: 0,
            paddle: {
                x: side == 1 ? Paddle_Width / 2 : 1 - Paddle_Width / 2,
                y: 0.5,
                width: Paddle_Width,
                height: Paddle_Height,
                speed: Paddle_Speed,
                color: '#9336B4',
            },
            gameID: this.gameId,
            ready: login == 'Computer' ? true :  false,
        }
    }

    // public setPlayerReady(playerLogin: string): void {
    //     const player = this.game_status.players.find(player => player.login === playerLogin)
    //     if (player) player.ready = true
    // }

    // public isPlayersReady(playerLogin?: string): boolean {
    //     if (playerLogin) {
    //         const player = this.game_status.players.find(player => player.login === playerLogin)
    //         if (player) return player.ready
    //     }
    //     const players = this.game_status.players
    //     return players[0].ready && players[1].ready
    // }

    // public setWinner(playerLogin: string): void {
    //     const playerIndex = this.game_status.players.findIndex(
    //         player => player.login === playerLogin,
    //     )
    //     if (playerIndex !== -1) {
    //         this.winner = this.game_status.players[playerIndex].login
    //     }
    // }

    // public setLoser(playerLogin: string): void {
    //     const playerIndex = this.game_status.players.findIndex(
    //         player => player.login === playerLogin,
    //     )

    //     if (playerIndex !== -1) {
    //         const opponentIndex = playerIndex === 0 ? 1 : 0
    //         this.winner = this.game_status.players[opponentIndex].login
    //     }
    // }

    // public checkWinner(): boolean {
    //     if (this.winner) return true
    //     const player1Score = this.game_status.players[0].score
    //     const player2Score = this.game_status.players[1].score
    //     // if (player1Score === 10 && player2Score === 10 && !this.isDeuce) {
    //     //     this.isDeuce = true
    //     //     this.events.emit('Game-Deuce')
    //     // }
    //     if (this.isDeuce) {
    //         if (player1Score - player2Score === 2 || player2Score - player1Score === 2) {
    //             this.winner =
    //                 player1Score > player2Score
    //                     ? this.game_status.players[0].login
    //                     : this.game_status.players[1].login
    //             return true
    //         }
    //     } else {
    //         if (player1Score === 11) {
    //             this.winner = this.game_status.players[0].login
    //             return true
    //         }
    //         if (player2Score === 11) {
    //             this.winner = this.game_status.players[1].login
    //             return true
    //         }
    //     }
    //     return false
    // }

    // public getWinner(): PlayerDto {
    //     return this.game_status.players.find(player => player.login === this.winner)
    // }

    // public updateComputer(): void {
    //     const computer = this.game_status.players.find(player => player.login === 'Computer')
    //     const ball = this.game_status.ball
    //     const paddle = computer.paddle
    //     if (computer) {
    //         if (ball.dx < 0) return

    //         const distance = Math.abs(1 - ball.x)
    //         const timeToReachPaddle = distance / Math.abs(ball.dx)
    //         const predictedBallY = ball.y + ball.dy * timeToReachPaddle

    //         let targetY = predictedBallY

    //         targetY = Math.max(paddle.height / 2, Math.min(1 - paddle.height / 2, targetY))

    //         if (paddle.y < targetY) {
    //             paddle.y += Math.min(COMPUTER_SPEED, targetY - paddle.y)
    //         } else if (paddle.y > targetY) {
    //             paddle.y -= Math.min(COMPUTER_SPEED, paddle.y - targetY)
    //         }
    //     }
    // }

    // update the game by updating the ball position and checking for collisions
    // public updateGame(): void {
    //     if (this.game_status.countDown > 0) {
    //         this.game_status.countDown -= 1 / 60
    //         return
    //     }

    //     this.updateBall()
    //     this.updateTimer()
    //     if (this.getPlayer2ID() === 'Computer') this.updateComputer()
    // }

    // update the ball position and check for collisions
    // private updateBall(): void {
    //     this.moveBall(this.game_status.ball)
    //     this.checkBallCollision(this.game_status)
    // }

    // move the ball to the next position
    // private moveBall(ball: BallDto): void {
    //     if (ball.dx > BALL_RADIUS) ball.dx = BALL_RADIUS - 0.001
    //     ball.x += ball.dx
    //     ball.y += ball.dy
    // }

    // reset the ball position that is out of bounds to the center
    // private checkWallCollision(ball: BallDto): void {
    //     if ((ball.y <= ball.radius && ball.dy < 0) || (ball.y >= 1 - ball.radius && ball.dy > 0)) {
    //         ball.dy *= -1
    //         this.events.emit('play-sound', 'ball-hit')
    //     }
    // }

    // check if the ball collided with a player paddle
    // private checkPlayerCollision(ball: BallDto, paddle: PaddleDto, playerIndex: number): boolean {
    //     const paddleLeft = playerIndex === 0 ? paddle.x : paddle.x - paddle.width
    //     const paddleRight = playerIndex === 0 ? paddle.x + paddle.width : paddle.x
    //     const paddleTop = paddle.y - paddle.height / 2
    //     const paddleBottom = paddle.y + paddle.height / 2
    //     return (
    //         ball.y + ball.radius >= paddleTop &&
    //         ball.y - ball.radius <= paddleBottom &&
    //         ball.x + ball.radius >= paddleLeft &&
    //         ball.x - ball.radius <= paddleRight
    //     )
    // }
    // check if the ball collided with wall or paddle and update the score if it is out of bounds
    // private checkBallCollision(game: gameStatusDto): void {
    //     const { ball, players } = game

    //     this.checkWallCollision(ball)

    //     // Check if the ball is within the horizontal range of the left paddle
    //     if (ball.x <= players[0].paddle.x + players[0].paddle.width && ball.dx < 0) {
    //         if (this.checkPlayerCollision(ball, players[0].paddle, 0)) {
    //             this.analyzePlayer.get(players[0].login).BlockingShot += 1
    //             this.reflectBall(ball, players[0].paddle)
    //             this.handleHikenPowerUp(game, 0)
    //             this.handleShinigamiPowerUp(game, 0)
    //         } else if (ball.x < 0) {
    //             // Ball crossed the left boundary
    //             players[1].score += 1
    //             this.grantBallWhispererAchievement(ball, players[1])
    //             this.grantPaddleSamuraiAchievement(players[0])
    //             this.resetBallPosition(ball)
    //         }
    //     }
    //     // Check if the ball is within the horizontal range of the right paddle
    //     else if (ball.x >= players[1].paddle.x - players[1].paddle.width && ball.dx > 0) {
    //         if (this.checkPlayerCollision(ball, players[1].paddle, 1)) {
    //             this.analyzePlayer.get(players[1].login).BlockingShot += 1
    //             this.reflectBall(ball, players[1].paddle)
    //             this.handleHikenPowerUp(game, 1)
    //             this.handleShinigamiPowerUp(game, 1)
    //         } else if (ball.x > 1) {
    //             // Ball crossed the right boundary
    //             players[0].score += 1
    //             this.grantBallWhispererAchievement(ball, players[0])
    //             this.grantPaddleSamuraiAchievement(players[1])
    //             this.resetBallPosition(ball)
    //         }
    //     }
    // }

    // reflect the ball based on the paddle hit point
    // private reflectBall(ball: BallDto, paddle: PaddleDto): void {
    //     ball.dx *= -1
    //     if (this.gameType == 'classic') ball.dx += ball.dx * 0.005
    //     const relativePos = ball.y - paddle.y
    //     const paddleHitPoint = relativePos / (paddle.height / 2 + ball.radius)
    //     const angle = paddleHitPoint * REFLECT_ANGLE
    //     const ballSpeed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2)
    //     ball.dy = ballSpeed * Math.sin(angle * (Math.PI / 180))
    //     this.events.emit('play-sound', 'ball-hit')
    // }
    // reset the ball position to the center
    // private resetBallPosition(ball: BallDto): void {
    //     ball.x = 0.5
    //     ball.y = 0.5
    //     ball.dx = 0
    //     if (this.gameType == 'custom') {
    //         ball.dy = Math.random() * 0.02 - 0.01
    //     } else {
    //         ball.dy = 0
    //     }
    //     setTimeout(() => {
    //         ball.dx = Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED
    //         ball.dy = Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED
    //     }, 1500)
    // }

    // update the paddle position of the player based on the direction
    // public updatePaddlePosition(playerID: string, direction: string): void {
    //     const player = this.game_status.players.find(player => player.login === playerID)
    //     if (this.game_status.countDown > 0) return
    //     if (direction === 'up') {
    //         player.paddle.y -= player.paddle.speed
    //     } else if (direction === 'down') {
    //         player.paddle.y += player.paddle.speed
    //     }

    //     player.paddle.y = Math.max(
    //         0 + player.paddle.height / 2,
    //         Math.min(1 - player.paddle.height / 2, player.paddle.y),
    //     )
    // }

    // public updateTimer(): void {
    //     if (this.game_status.time > 0) {
    //         this.game_status.time -= 1 / 60
    //     } else {
    //         this.game_status.time = 0
    //     }
    // }
}