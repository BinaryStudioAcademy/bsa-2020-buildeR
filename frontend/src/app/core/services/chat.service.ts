import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { Message } from '@shared/models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  urlPrefix = '/chat';

  constructor(
    private httpService: HttpService
  ) {}

  getChatMessages(groupId: number){
    return this.httpService.getRequest<Message[]>(`${this.urlPrefix}/${groupId}`);
  }

  sendMessage(message: Message) {
    return this.httpService.postRequest<Message>(this.urlPrefix, message);
  }
}
