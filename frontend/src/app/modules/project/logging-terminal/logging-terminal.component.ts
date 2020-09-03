import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  HostListener,
} from '@angular/core';
import { BaseComponent } from '../../../core/components/base/base.component';
import { BuildLogService } from '../../../core/services/build-log.service';
import { delay, takeUntil } from 'rxjs/operators';
import { ProjectLogsService } from '@core/services/projects-logs.service';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

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
  private projectId: number;

  @ViewChild('bottom') private bottom: ElementRef;

  autoscroll = true;

  private lineNumber = 1;
  showLevels = false;
  showTimeStamps = false;

  private lastScrollYPos = -1;

  buildSteps: Map<number, [boolean, Action[]]> = new Map<
    number,
    [boolean, Action[]]
  >();

  constructor(
    private logsService: ProjectLogsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
    route.parent.params.subscribe((params) => this.projectId = params.projectId);
  }

  ngOnInit(): void {
    this.logsService.buildConnection();
    this.logsService.startConnectionAndJoinGroup(this.projectId.toString());
    this.logsService.logsListener(this.log);
    this.log.subscribe((message) => {
      this.buildLog(this.formatLog(message));
    });
    this.logsService.receiveLogs().pipe(takeUntil(this.unsubscribe$))
    .subscribe((logs) => {
      logs.forEach(log => {
        this.buildLog(this.formatExistingLog(log));
      });
    });
  }

  @HostListener('window:scroll', ['$event']) onScroll(_: Event){
    const yPos = window.scrollY;
    if (yPos < this.lastScrollYPos) {
      this.autoscroll = false;
    }
    this.lastScrollYPos = yPos;
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

    const step = parseInt(logMatchArray[1], 10);

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
    const { timestamp: Timestamp, message: Message } = log;
    return `[${this.step++} ${Timestamp} INF] ${Message}`;
  }

  formatExistingLog(log: Log){
    return `[${this.step++} ${log.timestamp} INF] ${log.message}`;
  }

  scrollTop(el: HTMLElement) {
    el.scrollIntoView(true);
    window.scrollBy(0, -75);
  }

  scrollBottom(el: HTMLElement) {
    el.scrollIntoView(true);
  }
}

export class Log {
  timestamp: Date;
  message: string;
  buildHistoryId: number;
  projectId: number;
}
