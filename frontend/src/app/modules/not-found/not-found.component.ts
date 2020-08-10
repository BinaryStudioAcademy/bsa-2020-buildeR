import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.sass']
})
export class NotFoundComponent implements OnInit {
  link: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.link = this.router.url;
  }

}
