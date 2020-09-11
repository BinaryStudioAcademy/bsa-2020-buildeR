import { Injectable, OnDestroy } from '@angular/core';
import { SignalRHubFactoryService } from '@core/services/signalr-hub-factory.service';
import { SignalRHub } from '@core/models/signalr-hub';
import { StatusChange } from '@shared/models/status-change';
import { Subject } from 'rxjs';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';
import { ToastrNotificationsService } from './toastr-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class BuildStatusesSignalRService implements OnDestroy {
  private buildStatusesHub: SignalRHub;
  private buildStatusChanges$ = new Subject<StatusChange>();

  private currentUser: User;

  connecting: Promise<void>;

  isRegistered = false;

  constructor(
    private signalRService: SignalRHubFactoryService,
    private authService: AuthenticationService,
    private toastr: ToastrNotificationsService
  ) {}

  connect() {
    this.currentUser = this.authService.getCurrentUser();
    this.configureSignalR();
  }

  ngOnDestroy() {
    this.buildStatusesHub.disconnect();
    this.buildStatusChanges$.complete();
  }

  private configureSignalR() {
    if (!this.buildStatusesHub) {
      this.buildStatusesHub = this.signalRService.createHub(
        '/buildstatuseshub'
      );
      this.connecting = this.buildStatusesHub.start();
    }

    this.connecting
      .then(() => {
        this.buildStatusesHub
          .invoke('JoinGroup', this.currentUser.id.toString())
          .then(() =>
            this.buildStatusesHub.listen('statusChange').subscribe((resp) => {
              const statusChange: StatusChange = JSON.parse(resp);
              this.buildStatusChanges$.next(statusChange);
            })
          )
          .catch((err) => this.toastr.showError(err));
      })
      .catch((err) => this.toastr.showError(err));
  }

  listen() {
    return this.buildStatusChanges$;
  }
}
