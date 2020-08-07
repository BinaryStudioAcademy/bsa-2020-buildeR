import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../components/modal-content/modal-content.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NgbModal) { }

  open(message: string = 'Are you sure?',
       text: string = 'Changes will not be saved' ){
    const content = {
      title : 'Please confirm your action',
      message,
      text,
    };
    const modalRef = this.modalService.open(ModalContentComponent);
    modalRef.componentInstance.content = content;
    return modalRef.result.then(() => true).catch(() => false);
  }
}
