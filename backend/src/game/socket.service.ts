import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io'

@Injectable()
export class SocketService {
    private server: Server

    setServer(server: Server): void {
        this.server = server
    }

    emitToRoom(group: string, event: string, data: any): void {
        this.server.to(group).emit(event, data)
    }

    emitToServer(event: string, data: string)
    {
        this.server.emit(event, data);
    }
}