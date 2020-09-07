import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "../../../core/components/base/base.component";
import {UserService} from "@core/services/user.service";
import {UserLetter} from "@shared/models/user/user-letter";
import {ActivatedRoute} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RequestsModalComponent} from "@modules/admin-area/requests/requests-modal.component/requests-modal.component";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.sass']
})
export class RequestsComponent extends BaseComponent implements OnInit {

  currentUserLetters: UserLetter[] = {} as UserLetter[];
  allUserLetters: UserLetter[] = {} as UserLetter[];
  onlyIsRespondLetters: UserLetter[] = {} as UserLetter[];
  onlyIsNotRespondLetters: UserLetter[] = {} as UserLetter[];

  constructor(private userService: UserService,
              private activeRoute: ActivatedRoute,
              private modalService: NgbModal)
  { super(); }

  ngOnInit(): void {
   this.activeRoute.data.subscribe(data => {
     this.allUserLetters = data.userLetters;
     this.currentUserLetters = this.allUserLetters;
     console.log(this.currentUserLetters);
     });
   this.userService.getUserLettersCheckRespond(true).subscribe(letters => {
     this.onlyIsRespondLetters = letters;
     console.log(this.onlyIsRespondLetters);
   })
    this.userService.getUserLettersCheckRespond(false).subscribe(letters => {
      this.onlyIsNotRespondLetters = letters;
      console.log(this.onlyIsNotRespondLetters);
    })
  }

  openModal(userLetter: UserLetter) {
    const activeModal = this.modalService.open(RequestsModalComponent);
    (activeModal.componentInstance as RequestsModalComponent).currentLetter = userLetter;
  }

  changeOnAll() {
    this.currentUserLetters = this.allUserLetters;
  }

  chaneOnIsRespond() {
    this.currentUserLetters = this.onlyIsRespondLetters;
  }

  changeOnIsNotRespond() {
    this.currentUserLetters = this.onlyIsNotRespondLetters;
  }

}
