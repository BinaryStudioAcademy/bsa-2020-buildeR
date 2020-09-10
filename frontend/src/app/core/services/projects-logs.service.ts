import { Injectable, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
import { IProjectLog } from '@shared/models/project/project-log';
import { SignalRHubFactoryService } from './signalr-hub-factory.service';
import { SignalRHub } from '@core/models/signalr-hub';

@Injectable({
  providedIn: 'root',
})
export class ProjectLogsService implements OnDestroy {
  private logsHub: SignalRHub;

  private routePrefix = '/logsHub';

  subscriptions$ = new Map<number, Subject<string>>();

  connecting: Promise<void>;

  constructor(
    private httpService: HttpService,
    private signalRService: SignalRHubFactoryService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions$.forEach((subject) => {
      subject.complete();
    });
    this.subscriptions$.clear();
    this.logsHub.disconnect();
  }

  disconnect(buildHistoryId: number) {
    if (this.subscriptions$.has(buildHistoryId)) {
      this.subscriptions$.get(buildHistoryId).complete();
      this.subscriptions$.delete(buildHistoryId);
    }
  }

  private configureSignalR() {
    if (!this.logsHub) {
      this.logsHub = this.signalRService.createHub(this.routePrefix);
      this.connecting = this.logsHub.start();
    }
  }

  connect(buildHistoryId: number) {
    this.configureSignalR();
    this.connecting
      .then(() => {
      console.log("resolved");
        this.logsHub
          .invoke('JoinGroup', buildHistoryId.toString())
          .then(() => {
            this.logsHub.hubConnection.on('Broadcast', (groupId, log) => {
              const group = Number(groupId);
              if (!this.subscriptions$.has(Number(group))) {
                const subscription$ = new Subject<string>();
                this.subscriptions$.set(group, subscription$);
              }
              this.subscriptions$.get(group).next(log);
            });
          })
          .catch((err) => console.error(err))
        })

      .catch((err) => console.error(err));
  }

  listen(buildHistoryId: number): Subject<string> {
    if (!this.subscriptions$.has(buildHistoryId)) {
      this.subscriptions$.set(buildHistoryId, new Subject<string>());
    }
    return this.subscriptions$.get(buildHistoryId);
  }

  public getLogsOfHistory(
    projectId: number,
    buildHistoryId: number
  ): Observable<IProjectLog[]> {
    return this.httpService.getRequest(
      `${this.routePrefix}/${projectId}/${buildHistoryId}`
    );
  }
}
