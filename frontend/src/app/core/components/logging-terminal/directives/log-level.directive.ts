import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { LogLevel } from '../logging-terminal.component';

@Directive({
  selector: '[appLogLevel]',
})
export class LogLevelDirective implements AfterViewInit {
  @Input('appLogLevel') level: LogLevel = {} as LogLevel;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.addClass(this.elRef.nativeElement, this.level);
  }
}
