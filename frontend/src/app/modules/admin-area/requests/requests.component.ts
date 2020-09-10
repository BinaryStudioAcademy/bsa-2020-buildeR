import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "../../../core/components/base/base.component";
import {UserService} from "@core/services/user.service";
import {UserLetter} from "@shared/models/user/user-letter";
import {ActivatedRoute} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RequestsModalComponent} from "@modules/admin-area/requests/requests-modal.component/requests-modal.component";
import {ToastrNotificationsService} from "@core/services/toastr-notifications.service";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.sass']
})
export class RequestsComponent extends BaseComponent implements OnInit {

  currentUserLetters:UserLetter[];
  allUserLetters: UserLetter[];

  constructor(private userService: UserService,
              private activeRoute: ActivatedRoute,
              private modalService: NgbModal,
              private toastrService: ToastrNotificationsService)
  { super(); }

  ngOnInit(): void {
    this.changeOnAll();
  }

  openModal(userLetter: UserLetter) {
    const activeModal = this.modalService.open(RequestsModalComponent);
    (activeModal.componentInstance as RequestsModalComponent).currentLetter = userLetter;
    activeModal.result.then( (result) =>
    {
      if(result === 'Send')
      this.onChange();
    }, error => console.log(error));
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

  onChange() {
    var selectBox = (document.getElementById("selectBox") as HTMLSelectElement);
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;

    switch (selectedValue) {
      case 'All': {
        this.changeOnAll();
        break;
      }
      case 'Respond': {
        this.chaneOnIsRespond();
        break;
      }
      case 'Not respond': {
        this.changeOnIsNotRespond();
        break;
      }
    }


  }

}
