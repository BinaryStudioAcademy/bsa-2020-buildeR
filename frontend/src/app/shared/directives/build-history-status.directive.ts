import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  Input,
} from '@angular/core';
import { BuildStatus } from '@shared/models/build-status';

@Directive({
  selector: '[appBuildHistoryStatus]',
})
export class BuildHistoryStatusDirective implements AfterViewInit {
  @Input('appBuildHistoryStatus') status: BuildStatus;
  private statusColor: string;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    switch (this.status) {
      case BuildStatus.Success:
        this.statusColor = '#39aa56';
        break;
      case BuildStatus.Error:
        this.statusColor = '#db4545';
        break;
      case BuildStatus.Failure:
        this.statusColor = '#db4545';
        break;
      case BuildStatus.Pending:
        this.statusColor = '#0092fe';
        break;
      case BuildStatus.Canceled:
        this.statusColor = '#9d9d9d';
        break;
      case BuildStatus.InProgress:
        this.statusColor = '#edde3f';
        break;
    }

    this.renderer.setStyle(
      this.elRef.nativeElement,
      'color',
      `${this.statusColor}`
    );
  }
}
