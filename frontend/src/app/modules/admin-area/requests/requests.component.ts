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

  constructor(private userService: UserService,
              private activeRoute: ActivatedRoute,
              private modalService: NgbModal)
  { super(); }

  ngOnInit(): void {
   this.activeRoute.data.subscribe(data => {
     this.allUserLetters = data.userLetters;
     this.currentUserLetters = this.allUserLetters;
     });
  }

  openModal(userLetter: UserLetter) {
    const activeModal = this.modalService.open(RequestsModalComponent);
    (activeModal.componentInstance as RequestsModalComponent).currentLetter = userLetter;
  }

  changeOnAll() {
    this.userService.getAllUserLetters().subscribe(letters =>
    {
      this.allUserLetters = letters;
      this.currentUserLetters = this.allUserLetters;
    });
  }

  chaneOnIsRespond() {
    this.userService.getAllUserLetters().subscribe(letters =>
    {
      this.allUserLetters = letters;
      this.currentUserLetters = this.allUserLetters.filter(l => l.isRespond == true);
    });
  }

  changeOnIsNotRespond() {
    this.userService.getAllUserLetters().subscribe(letters =>
    {
      this.allUserLetters = letters;
      this.currentUserLetters = this.allUserLetters.filter(l => l.isRespond == false);
    });
  }

}
