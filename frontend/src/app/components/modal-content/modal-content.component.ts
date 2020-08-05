import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.sass']
})
export class ModalContentComponent implements OnInit {

  @Input() public content;
  @Output() passEntry: EventEmitter<boolean> = new EventEmitter();
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  confirm(){
    this.passEntry.emit(true);
    this.activeModal.close();
  }
  decline(){
    this.passEntry.emit(false);
    this.activeModal.close();
  }
}
