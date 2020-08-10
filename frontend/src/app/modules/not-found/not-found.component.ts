import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.sass']
})
export class NotFoundComponent implements OnInit {
  link: string;
  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.link = this.location.path();
    console.log(this.router.url);
  }

}
