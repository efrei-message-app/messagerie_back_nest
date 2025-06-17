import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitMessageToConversation(conversationId: string, message: any) {
     console.log(`🟡 Emitting message to room ${conversationId}`, message);
    this.server.to(conversationId).emit('newMessage', message);
  }

    // CLients asks for joining chatroom to receive in real time message
  @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
        console.log(conversationId)
    client.join(conversationId);
    }
}