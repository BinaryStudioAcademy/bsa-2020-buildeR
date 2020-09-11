import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrNotificationsService {
  toastConfig: object = {timeOut: 5000, closeButton: true, positionClass: 'toast-bottom-right'};

  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string = 'Success!', toastConfig: object = this.toastConfig) {
    this.toastr.success(message, title, toastConfig);
  }

  showError(message: string, title: string = 'Error!', toastConfig: object = this.toastConfig) {
    this.toastr.error(message, title, toastConfig);
  }

  showWarning(message: string, title: string = 'Warning', toastConfig: object = this.toastConfig) {
    this.toastr.warning(message, title, toastConfig);
  }

  showInfo(message: string, title: string = 'Info!', toastConfig: object = this.toastConfig) {
    this.toastr.info(message, title, toastConfig);
  }
}
