import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-email-verification-modal',
  templateUrl: './email-verification-modal.component.html',
  styleUrls: ['./email-verification-modal.component.sass']
})
export class EmailVerificationModalComponent implements OnInit {

  @Input() email: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.activeModal.close();
  }

}
