import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { BuildStatus } from '../models/build-status';
import { BuildStatusColor } from '../models/build-status-color';

@Directive({
  selector: '[buildStatusColor]',
})
export class BuildStatusColorDirective implements OnInit {
  @Input()
  buildStatus: BuildStatus;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.color = BuildStatusColor[this.buildStatus];
  }
}
