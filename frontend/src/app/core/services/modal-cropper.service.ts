import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PhotoCropperContentComponent } from 'src/app/modules/user/photo-cropper-content/photo-cropper-content.component';

@Injectable({
  providedIn: 'root'
})
export class ModalCropperService {

  constructor(private modalService: NgbModal) { }

  open(): Promise<File>{
    const modalRef = this.modalService.open(PhotoCropperContentComponent);
    return modalRef.result.then((res) => res).catch(() => alert('Image not loaded'));
  }
}
