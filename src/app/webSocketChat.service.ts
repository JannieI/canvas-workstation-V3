/*
 * Chat service using the web socket service
 */

// TODO - is this still used?


import { Injectable }                 from '@angular/core';
import { WebsocketService }           from './webSocket.service';
import { Observable }                 from 'rxjs';
import { Subject }                    from 'rxjs';
import { map }                        from 'rxjs/operators';

@Injectable()
export class WebSocketChatService {
  
  messages: Subject<any>;
  
  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService
      .connect()
      .pipe(map((response: any): any => {
        return response;
      }))
   }
  
  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
    this.messages.next(msg);
  }

}