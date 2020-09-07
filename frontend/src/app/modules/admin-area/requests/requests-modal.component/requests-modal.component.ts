import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {UserService} from "../../../../core/services/user.service";
import {UserLetter} from "../../../../shared/models/user/user-letter";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {emailDotValidator} from "@core/validators/email-dot-validator";
import {ToastrNotificationsService} from "@core/services/toastr-notifications.service";


@Component({
  selector: 'app-requests-modal',
  templateUrl: './requests-modal.component.html',
  styleUrls: ['./requests-modal.component.sass'],
})
export class RequestsModalComponent implements OnInit {
  isShowSpinner: boolean = false;
  answerText: string;
  currentLetter: UserLetter = {} as UserLetter;
  requestsForm: FormGroup;

  constructor(
    private userService: UserService,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrNotificationsService
  ) { }

  ngOnInit(): void {
    this.requestsForm = new FormGroup({
      userName: new FormControl({value: this.currentLetter.userName, disabled:true }),
      userEmail: new FormControl({value: this.currentLetter.userEmail, disabled:true}),
      subject: new FormControl({value: this.currentLetter.subject, disabled:true}),
      description: new FormControl({value: this.currentLetter.description, disabled:true}),
      answer: new FormControl(this.answerText, [Validators.required])
    });
  }

  send(answerText: string): void{
    this.isShowSpinner = true;
    this.userService.sendLetterToUser(this.currentLetter, answerText)
      .subscribe(letter => {
        this.toastrService.showSuccess("Your letter was delivered!");
        this.isShowSpinner = false;
      },error => {
      console.error(error);
      this.toastrService.showError('Your letter wasn\'t delivered!');
      this.isShowSpinner = false;
    });
  }

  closeForm() {
    this.activeModal.close();
  }

}
