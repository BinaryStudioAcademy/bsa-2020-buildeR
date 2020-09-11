import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html'
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() overlay: boolean;
  @Input() size = '20px';
  @Input() top = '30%';
  @Input() left = '49%';
  @Input() position = 'absolute';
  @Input() margin = '100px auto';

  constructor() { }

  ngOnInit(): void { }

}
