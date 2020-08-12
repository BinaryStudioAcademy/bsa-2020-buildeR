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
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  fileChangeEvent(event): void {
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
  const file = new File([this.croppedImage], 'image.png');
  this.activeModal.close(file);
}
}
