import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.sass']
})
export class LoadingSpinnerComponent implements OnInit {

  @Input() size = '20px';
  @Input() top = '30%';
  @Input() left = '49%';
  @Input() position = 'absolute';
  @Input() margin = '100px auto';

  @ViewChild('spinner')
  spinner: ElementRef;

  constructor() { }

  ngOnInit(): void { }

}
