import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.sass']
})
export class ModalContentComponent {

  @Input() content;
  constructor(public activeModal: NgbActiveModal) { }

  confirm() {
    this.activeModal.close(true);
  }
  decline() {
    this.activeModal.dismiss(false);
  }
}
