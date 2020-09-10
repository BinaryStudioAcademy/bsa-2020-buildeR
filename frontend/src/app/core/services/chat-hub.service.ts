import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class ChatHubService{
  private hubConnection: HubConnection;

  buildConnection() {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(`${environment.signalRUrl}/messageshub`)
    .build();
  }

  startConnectionAndJoinGroup(groupName: string) {
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
  messageListener(messageSubject: Subject<string>) {
    this.hubConnection.on('newMessage', (data) => {
      messageSubject.next(data);
    });
  }
}
