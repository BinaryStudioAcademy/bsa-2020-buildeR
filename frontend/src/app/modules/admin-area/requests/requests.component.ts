import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "../../../core/components/base/base.component";
import {UserService} from "@core/services/user.service";
import {UserLetter} from "@shared/models/user/user-letter";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.sass']
})
export class RequestsComponent extends BaseComponent implements OnInit {

  currentUserLetters: UserLetter[] = {} as UserLetter[];

  constructor(private userService: UserService,
              private activeRoute: ActivatedRoute)
  { super(); }

  ngOnInit(): void {
   this.activeRoute.data.subscribe(data => {
     this.currentUserLetters = data.userLetters;
     });
  }
}
