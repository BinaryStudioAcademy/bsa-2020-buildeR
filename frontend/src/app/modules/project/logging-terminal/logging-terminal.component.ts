import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BaseComponent } from '../../../core/components/base/base.component';
import { BuildLogService } from '../../../core/services/build-log.service';
import { delay } from 'rxjs/operators';
import { ProjectLogsService } from '@core/services/projects-logs.service';
import { Subject } from 'rxjs';

export type LogLevel = 'WRN' | 'ERR' | 'FTL' | 'INF' | 'DBG' | 'VRB';

type Action = {
  level: LogLevel;
  date: Date;
  body?: string;
  number: number;
};

@Component({
  selector: 'app-logging-terminal',
  templateUrl: './logging-terminal.component.html',
  styleUrls: ['./logging-terminal.component.sass'],
})
export class LoggingTerminalComponent extends BaseComponent
  implements OnInit, OnDestroy {
  private log = new Subject<string>();
  private step = 1;
  private logRegExr = /^\[(\d+) (.+) (\w+)\](.*)/;

  @ViewChild('bottom') private bottom: ElementRef;

  autoscroll = true;

  private lineNumber: number = 1;

  showLevels: boolean = false;
  showTimeStamps: boolean = false;

  buildSteps: Map<number, [boolean, Action[]]> = new Map<
    number,
    [boolean, Action[]]
  >();

  constructor(
    private buildService: BuildLogService,
    private logsService: ProjectLogsService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.buildService
    //   .getTestBuildLog()
    //   .pipe(delay(0))
    //   .subscribe((line) => this.buildLog(line));
    this.logsService.buildConnection();
    this.logsService.startConnectionAndJoinGroup('111'); // '111' is buildId of our demo project
    this.logsService.logsListener(this.log);
    this.log.subscribe((message) => {
      this.buildLog(this.formatLog(message));
    });
  }

  ngOnDestroy(): void {
    this.logsService.stopConnection();
  }

  loggin() {
    this.log.subscribe((line) => {
      this.buildLog(line);
    });
  }

  clear() {
    this.buildSteps.clear();
    this.lineNumber = 0;
  }

  setExpand(key: number) {
    this.buildSteps.get(key)[0] = !this.buildSteps.get(key)[0];
  }

  private buildLog(line: string) {
    if (this.autoscroll) {
      this.scrollBottom(this.bottom.nativeElement);
    }

    const [step, action] = this.parseLine(line);
    this.appendLog(step, action);
  }

  private parseLine(line: string): [number, Action] {
    const a: Action = {} as Action;

    a.number = this.lineNumber++;

    const logMatchArray = line.match(this.logRegExr);

    // @ts-ignore
    a.date = new Date(logMatchArray[2]);
    a.level = logMatchArray[3] as LogLevel;
    a.body = logMatchArray[4];

    const step = parseInt(logMatchArray[1]);

    return [step, a];
  }

  private appendLog(step: number, a: Action) {
    if (!this.buildSteps.has(step)) {
      this.buildSteps.set(step, [false, []]);
    }

    this.buildSteps.get(step)[1].push(a);
  }

  // Temporary solution for converting logs to existing format
  private formatLog(line: string) {
    const log: Log = JSON.parse(line);
    const { Timestamp, Message } = log;
    return `[${this.step++} ${Timestamp} INF] ${Message}`;
  }

  scrollTop(el: HTMLElement) {
    el.scrollIntoView(true);
    window.scrollBy(0, -75);
  }

  scrollBottom(el: HTMLElement) {
    el.scrollIntoView(true);
  }
}

class Log {
  Timestamp: Date;
  Message: string;
  BuildId: number;
  BuildStep: number;
}
