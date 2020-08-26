import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.sass']
})
export class LoadingSpinnerComponent implements OnInit, AfterViewInit {

  @Input() size = '20px';
  @Input() top = '30%';
  @Input() left = '49%';
  @Input() position = 'absolute';
  @Input() margin = '100px auto';

  @ViewChild('spinner')
  spinner: ElementRef;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    (this.spinner.nativeElement as HTMLDivElement).style.fontSize = this.size;
    (this.spinner.nativeElement as HTMLDivElement).style.top = this.top;
    (this.spinner.nativeElement as HTMLDivElement).style.left = this.left;
    (this.spinner.nativeElement as HTMLDivElement).style.position = this.position;
    (this.spinner.nativeElement as HTMLDivElement).style.margin = this.margin;
  }
}
