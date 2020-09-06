import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {UserService} from "../../../../core/services/user.service";
import {UserLetter} from "../../../../shared/models/user/user-letter";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {emailDotValidator} from "@core/validators/email-dot-validator";


@Component({
  selector: 'app-requests-modal',
  templateUrl: './requests-modal.component.html',
  styleUrls: ['./requests-modal.component.sass'],
})
export class RequestsModalComponent implements OnInit {

  answerText: string;
  currentLetter: UserLetter = {} as UserLetter;
  requestsForm: FormGroup;

  constructor(
    private userService: UserService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.requestsForm = new FormGroup({
      userName: new FormControl(this.currentLetter.userName),
      userEmail: new FormControl(this.currentLetter.userEmail),
      subject: new FormControl(this.currentLetter.subject),
      description: new FormControl(this.currentLetter.description),
      answer: new FormControl(this.answerText, [Validators.required])
    });
  }

  send(answerText: string): void{

  }

  closeForm() {
    this.activeModal.close();
  }

}
