import { Injectable, OnDestroy} from '@angular/core';
import { SignalRHubFactoryService } from '@core/services/signalr-hub-factory.service';
import { SignalRHub } from '@core/models/signalr-hub';
import { StatusChange } from '@shared/models/status-change';
import { Subject } from 'rxjs';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class BuildStatusesSignalRService
  implements OnDestroy {
  private buildStatusesHub: SignalRHub;
  private buildStatusChanges$ = new Subject<StatusChange>();

  private currentUser: User;

  constructor(
    private signalRService: SignalRHubFactoryService,
    private authService: AuthenticationService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.configureSignalR();
  }

  ngOnDestroy() {
    this.buildStatusesHub.disconnect();
    this.buildStatusChanges$.unsubscribe();
  }

  private configureSignalR() {
    this.buildStatusesHub = this.signalRService.createHub('/buildstatuseshub');
    this.buildStatusesHub
      .start()
      .then(() => {
        this.buildStatusesHub
          .invoke('JoinGroup', this.currentUser.id.toString())
          .then(null)
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
    this.buildStatusesHub.listen('statusChange').subscribe((resp) => {
      const statusChange: StatusChange = JSON.parse(resp);
      this.buildStatusChanges$.next(statusChange);
    });
  }

  listen() {
    return this.buildStatusChanges$;
  }
}
