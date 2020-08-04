import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../components/modal/modal.component';
import { stringify } from '@angular/compiler/src/util';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalRef: BsModalRef;
  constructor(private service: BsModalService ) { }

  open(message: string, text: string): void {
      const initialState = {
        list: [
          message,
          text
        ],
        title: 'Confirm your action'
      };
      this.modalRef = this.service.show(ModalComponent, {initialState});
      const res = this.modalRef.content.onClose.subscribe((result) => {
        console.log(result);
        return result;
      });
      console.log(this.modalRef.content.msg);
    }
}
