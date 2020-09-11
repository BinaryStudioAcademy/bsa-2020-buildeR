import { Component, OnInit, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { log } from 'console';
import {timer} from 'rxjs';

@Component({
  selector: 'app-photo-cropper-content',
  templateUrl: './photo-cropper-content.component.html',
  styleUrls: ['./photo-cropper-content.component.sass']
})
export class PhotoCropperContentComponent {
  constructor(private activeModal: NgbActiveModal, private toastr: ToastrNotificationsService) { }
  @Input() content;
  imageChangedEvent;
  croppedImage;
  canSave = false;
  imageName = '';
  isShowSpinner = false;

  fileChangeEvent(event): void {
    this.imageChangedEvent = event;
    this.imageName = event.target.files[0].name;
}
imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
}
imageLoaded() {
  this.canSave = true;
    // show cropper
}
cropperReady() {
    // cropper ready
}
loadImageFailed() {
    this.toastr.showError('Loading image occures error');
}

save(){
  this.isShowSpinner = true;
  if (!this.imageName){
    this.imageName = this.makeName(10) + '.png';
  }
  const file = this.base64ToFile(this.croppedImage, this.imageName);
  timer(600).subscribe(() => {
    this.activeModal.close(file);
    this.isShowSpinner = false;
  });
}

base64ToFile(data, filename) {

  const arr = data.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--){
      u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

close(){
  this.activeModal.dismiss();
}

makeName(length) {
  let result = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
}
