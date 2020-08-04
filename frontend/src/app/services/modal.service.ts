import { Injectable, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../components/modal/modal.component';
import { stringify } from '@angular/compiler/src/util';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalRef: BsModalRef;
  constructor(private service: BsModalService ) { }

  open(message: string, text: string): Promise<boolean>{
      const initialState = {

        message,
        text,
        title: 'Confirm your action'
      };
      this.modalRef = this.service.show(ModalComponent, {initialState});
      return new Promise<boolean>((resolve, reject) =>
      this.modalRef.content.onClose.subscribe((result) => resolve(result) ));
      // return this.modalRef.content.onClose.subscribe((result) => {
      //   console.log(result);
      //   return result;
      // });
    }
}
