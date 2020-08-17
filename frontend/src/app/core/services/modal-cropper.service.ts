import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PhotoCropperContentComponent } from 'src/app/modules/user/photo-cropper-content/photo-cropper-content.component';
import { ToastrNotificationsService } from './toastr-notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ModalCropperService {

  constructor(private modalService: NgbModal, private toastr: ToastrNotificationsService) { }

  open(): Promise<File>{
    const modalRef = this.modalService.open(PhotoCropperContentComponent);
    return modalRef.result.then((res) => res).catch(() => this.toastr.showError("Image hasn't been   loaded"));
  }
}
