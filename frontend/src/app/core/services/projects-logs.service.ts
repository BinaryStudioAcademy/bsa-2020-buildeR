import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
import { IProjectLog } from '@shared/models/project/project-log';

@Injectable({
  providedIn: 'root'
})
export class ProjectLogsService {
  private logsHubConnection: HubConnection;
  private routePrefix = '/logs';

  constructor(private httpService: HttpService) { }

  buildConnection() {
    this.logsHubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}/logsHub`)
      .build();
  }

  getLogsOfHistory(projectId: number, buildHisotryId: number) {
    return this.httpService.getRequest<IProjectLog[]>(`${this.routePrefix}/${projectId}/${buildHisotryId}`);
  }

  startConnectionAndJoinGroup(groupName: string) {
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

  stopConnection() {
    this.logsHubConnection
      .stop(); // It also makes user leave his group automaticlly after disconnecting
  }

  logsListener(logSubject: Subject<string>) {
    this.logsHubConnection.on('Broadcast', (data) => {
      logSubject.next(data);
    });
  }
}
