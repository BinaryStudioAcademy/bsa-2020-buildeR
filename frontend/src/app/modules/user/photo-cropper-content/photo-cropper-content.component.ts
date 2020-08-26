import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-photo-cropper-content',
  templateUrl: './photo-cropper-content.component.html',
  styleUrls: ['./photo-cropper-content.component.sass']
})
export class PhotoCropperContentComponent implements OnInit {
  imageChangedEvent;
  croppedImage;
  canSave = false;
  imageName = '';
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


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
    alert('Loading image occures error');
}

save(){

  const file = this.base64ToFile(this.croppedImage, this.imageName);
  this.activeModal.close(file);
}

base64ToFile(data, filename) {

  const arr = data.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

close(){
  this.activeModal.dismiss();
}
}
