import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-photo-cropper-content',
  templateUrl: './photo-cropper-content.component.html',
  styleUrls: ['./photo-cropper-content.component.sass']
})
export class PhotoCropperContentComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canSave: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
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
  console.log(this.croppedImage);
}
}
