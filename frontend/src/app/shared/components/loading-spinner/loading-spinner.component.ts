import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.sass']
})
export class LoadingSpinnerComponent implements OnInit, AfterViewInit {

  @Input() size = '20px';

  @ViewChild('spinner')
  spinner: ElementRef;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    (this.spinner.nativeElement as HTMLDivElement).style.fontSize = this.size;
  }
}
