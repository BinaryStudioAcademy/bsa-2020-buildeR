import { Injectable, OnDestroy } from '@angular/core';
import { SignalRHubFactoryService } from '../../core/services/signalr-hub-factory.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpService } from '../../core/services/http.service';
import { User } from '../../shared/models/user/user';
import { HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Message } from '@shared/models/message';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy{
  private currentUser: User;
  private hubConnection: HubConnection;
  urlPrefix = '/chat';

  constructor(
    private signalRService: SignalRHubFactoryService,
    private authService: AuthenticationService,
    private httpService: HttpService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }
  public buildConnection() {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(`${environment.signalRUrl}/messageshub`)
    .build();
  }

  public startConnectionAndJoinGroup(groupName: string) {
    this.hubConnection
     .start()
     .then(() => {
       console.log('Chat connected...');
       this.hubConnection.invoke('JoinGroup', groupName);
     })
     .catch(err => {
       console.log('Error while starting connection: ' + err);

       setTimeout(function() {
         this.startConnection();
       });
     });
  }
  ngOnDestroy(): void {
    //
  }

  sendMessage(message: Message) {
    console.log(this.urlPrefix);
    return this.httpService.postRequest<Message>(this.urlPrefix, message);
  }

  public messageListener(messageSubject: Subject<Message>) {
    this.hubConnection.on('newMessage', (data) => {
      messageSubject.next(data);
    });
  }
}
