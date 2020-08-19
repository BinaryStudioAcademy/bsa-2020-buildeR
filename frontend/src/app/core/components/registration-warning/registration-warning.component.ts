import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Providers } from '@shared/models/providers';

@Component({
  selector: 'app-registration-warning',
  templateUrl: './registration-warning.component.html',
  styleUrls: ['./registration-warning.component.sass']
})
export class RegistrationWarningComponent implements OnInit {

  @Input() provider: Providers;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  ok(){
    // switch(this.provider) {
    //   case Providers.Github: 
    // }
  }

  onCancel(){
    this.activeModal.close();
  }
}
