import { Socket } from 'socket.io'

export interface Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
}

export interface Ball {
    x: number;
    y: number;
    radius: number;
    speed: number;
    dirx: number;
    diry: number;
}

// export interface net {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
// }


export interface Computer {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
}


export interface ConnectedUser {
    login: string
    socket: Socket
    status: 'ingame' | 'inqueue' | 'online' | 'busy' | 'offline'
    // game?: PongGame
    powerUps?: string[]
    // pendingInvite?: InviteDto
}