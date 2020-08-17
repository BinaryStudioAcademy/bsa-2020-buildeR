import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectLogsService {
  private logsHubConnection: HubConnection;

  constructor() {
    this.buildConnection();
    this.startConnection();
   }

   private buildConnection() {
     this.logsHubConnection = new HubConnectionBuilder()
     .withUrl('http://localhost:5070/logsHub')
     .build();
   }

   private startConnection() {
     this.logsHubConnection
      .start()
      .then(() => {
        console.log('Connection started...');
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);

        setTimeout(function() {
          this.startConnection();
        }, 3000);
      });
   }

   public logsListener(logSubject: Subject<string>) {
     this.logsHubConnection.on('Broadcast', (data) => {
       logSubject.next(data);
     });
   }
}
