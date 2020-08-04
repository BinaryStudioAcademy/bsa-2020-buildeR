import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit {

  title: string;
  closeBtnName: string;
  list = [];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.list.push('PROFIT!!!');
  }
}
