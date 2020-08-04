import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit {

  onClose: Subject<boolean>;
  title: string;
  message: string;
  text: string;

  constructor(public bsModalRef: BsModalRef) {}
  ngOnInit(): void {
    this.onClose = new Subject();
  }

  confirm(): void{
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  decline(): void{
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
