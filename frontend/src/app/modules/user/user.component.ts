import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  setStyleActiveElement(el) {
    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    // event.className += " active";
    (el.currentTarget as HTMLElement).className += " active";
  }

}
