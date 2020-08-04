import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../components/modal/modal.component';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalRef: BsModalRef;
  constructor(private service: BsModalService ) { }

  openModalWithComponent(): void {
      const initialState = {
        list: [
          'Open a modal with component',
          'Pass your data',
          'Do something else',
          '...'
        ],
        title: 'Modal with component'
      };
      this.modalRef = this.service.show(ModalComponent, {initialState});
      this.modalRef.content.closeBtnName = 'Close';
    }
}
