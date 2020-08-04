import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit {

  public onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  title: string;
  closeBtnName: string;
  list = [];

  constructor(public bsModalRef: BsModalRef) {}
  ngOnInit(): void {
  }

  confirm(): void{
    this.onClose.emit(true);
    this.bsModalRef.hide();
  }

  decline(): void{
    this.onClose.emit(false);
    this.bsModalRef.hide();
  }
}
