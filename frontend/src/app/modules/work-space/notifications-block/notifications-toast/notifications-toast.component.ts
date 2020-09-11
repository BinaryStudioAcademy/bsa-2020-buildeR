import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AppNotificationsToasterService } from '@core/services/app-notifications-toaster.service';

@Component({
  selector: 'app-notifications-toast',
  templateUrl: './notifications-toast.component.html',
  styleUrls: ['./notifications-toast.component.sass']
})
export class NotificationsToastComponent implements OnInit {
  @Output() counterNotificationsToast = new EventEmitter<number>();

  constructor(public appNotificationsService: AppNotificationsToasterService) { }

  ngOnInit(): void {
  }

  markRead() {
    this.counterNotificationsToast.emit(-1);
  }

}
