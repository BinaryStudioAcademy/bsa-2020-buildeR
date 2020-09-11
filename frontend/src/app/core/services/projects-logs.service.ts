import { Injectable, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
import { IProjectLog } from '@shared/models/project/project-log';
import { SignalRHubFactoryService } from './signalr-hub-factory.service';
import { SignalRHub } from '@core/models/signalr-hub';
import { ToastrNotificationsService } from './toastr-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectLogsService implements OnDestroy {
  private logsHub: SignalRHub;

  subscriptions$ = new Map<number, Subject<string>>();

  connecting: Promise<void>;

  isRegistered = false;

  constructor(
    private httpService: HttpService,
    private signalRService: SignalRHubFactoryService,
    private toastr: ToastrNotificationsService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions$.forEach((subject) => {
      subject.complete();
    });
    this.subscriptions$.clear();
    this.logsHub.disconnect();
  }

  getLogsOfHistory(projectId: number, buildHisotryId: number) {
    return this.httpService.getRequest<IProjectLog[]>(
      `/logs/${projectId}/${buildHisotryId}`
    );
  }

  disconnect(buildHistoryId: number) {
    if (this.subscriptions$.has(buildHistoryId)) {
      this.subscriptions$.get(buildHistoryId).complete();
      this.subscriptions$.delete(buildHistoryId);
    }
  }

  private configureSignalR() {
    if (!this.logsHub) {
      this.logsHub = this.signalRService.createHub('/logsHub');
      this.connecting = this.logsHub.start();
    }
  }

  connect(buildHistoryId: number) {
    this.configureSignalR();
    this.connecting
      .then(() => {
        this.logsHub
          .invoke('JoinGroup', buildHistoryId.toString())
          .then(() => {
            if (!this.isRegistered) {
              this.logsHub.hubConnection.on('Broadcast', (groupId, log) => {
                const group = Number(groupId);
                if (!this.subscriptions$.has(Number(group))) {
                  const subscription$ = new Subject<string>();
                  this.subscriptions$.set(group, subscription$);
                }
                this.subscriptions$.get(group).next(log);
              });
              this.isRegistered = true;
            }
          })
          .catch((err) => this.toastr.showError(err));
      })
      .catch((err) => this.toastr.showError(err));
  }

  listen(buildHistoryId: number): Subject<string> {
    if (!this.subscriptions$.has(buildHistoryId)) {
      this.subscriptions$.set(buildHistoryId, new Subject<string>());
    }
    return this.subscriptions$.get(buildHistoryId);
  }
}
