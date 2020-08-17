import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectLogsService {
  private logsHubConnection: HubConnection;

  constructor() {
   }

   public buildConnection() {
     this.logsHubConnection = new HubConnectionBuilder()
     .withUrl(environment.logsHub)
     .build();
   }

   public startConnectionAndJoinGroup(groupName: string) {
     this.logsHubConnection
      .start()
      .then(() => {
        console.log('Connection started...');
        this.logsHubConnection.invoke('JoinGroup', groupName); // Automatically join group after connecting
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);

        setTimeout(function() {
          this.startConnection();
        }, 3000);
      });
   }

   public stopConnection() {
     this.logsHubConnection
      .stop(); // It also makes user leave his group automaticlly after disconnecting
   }

   public logsListener(logSubject: Subject<string>) {
     this.logsHubConnection.on('Broadcast', (data) => {
       logSubject.next(data);
     });
   }
}
