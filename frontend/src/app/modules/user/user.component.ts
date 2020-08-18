import { Component, OnInit } from '@angular/core';
import {User} from "../../shared/models/user/user";
import {ActivatedRoute} from "@angular/router";
import {ModalCropperService} from "../../core/services/modal-cropper.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {

  currentUser: User = {} as User;

  constructor(private route: ActivatedRoute, private cropper: ModalCropperService) { }

  ngOnInit(): void {
    this.route.data.subscribe( data => this.currentUser = data.user);
    console.log(this.currentUser);
  }

  setStyleActiveElement(el) {
    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    // event.className += " active";
    (el.currentTarget as HTMLElement).className += " active";
  }

  async open(){
    const file = await this.cropper.open();
    if (file){
      console.log('we have cropped ' + typeof(file));
      // now we can use it for saving image logic
    }
    else{
      console.log('Image didn`t change');
    }
  }

}
