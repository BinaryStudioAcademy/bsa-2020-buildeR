import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { BuildStatus } from '../models/build-status';

@Directive({
  selector: '[buildStatusIcon]',
})
export class BuildStatusIconDirective implements OnInit {
  icons: string[] = ['&#9888;', '&#10008', '&#10004;']; // TODO: is this approach acceptable there?

  @Input()
  buildStatus: BuildStatus;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.innerHTML = this.icons[this.buildStatus];
  }
}
