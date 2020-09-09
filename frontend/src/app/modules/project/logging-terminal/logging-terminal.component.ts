import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';
import { BaseComponent } from '../../../core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { ProjectLogsService } from '@core/services/projects-logs.service';
import { Subject } from 'rxjs';
import { Project } from '@shared/models/project/project';
import { IProjectLog } from '@shared/models/project/project-log';

export type LogLevel = 'WRN' | 'ERR' | 'FTL' | 'INF' | 'DBG' | 'VRB';

interface IAction {
  level: LogLevel;
  date: Date;
  body?: string;
  number: number;
}

@Component({
  selector: 'app-logging-terminal',
  templateUrl: './logging-terminal.component.html',
  styleUrls: ['./logging-terminal.component.sass'],
})
export class LoggingTerminalComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() isLive: boolean;
  @Input() project: Project;
  @Input() logs: string[];

  private log$ = new Subject<string>();
  private step = 1;
  private logRegExr = /^\[(\d+) (.+) (\w+)\](.*)/;

  @ViewChild('bottom') private bottom: ElementRef;
  rawLogs: string[] = [];
  autoscroll = true;
  private lineNumber = 1;
  showLevels = false;
  showTimeStamps = false;

  private lastScrollYPos = -1;

  buildSteps: Map<number, [boolean, IAction[]]> = new Map<number, [boolean, IAction[]]>();

  constructor(
    private logsService: ProjectLogsService,
  ) {
    super();
  }

  @HostListener('window:scroll', ['$event']) onScroll(_: Event) {
    const yPos = window.scrollY;
    if (yPos < this.lastScrollYPos) {
      this.autoscroll = false;
    }
    this.lastScrollYPos = yPos;
  }

  ngOnInit() {
    this.logsService.buildConnection();
    this.logsService.startConnectionAndJoinGroup(this.project.id.toString());
    this.logsService.logsListener(this.log$);
    this.log$.subscribe((message) => {
      this.buildLog(this.formatLog(message));
    });
    this.logsService.receiveLogs().pipe(takeUntil(this.unsubscribe$))
      .subscribe((logs) => {
        logs.forEach((log) => {
          this.buildLog(this.formatExistingLog(log));
        });
      });
  }

  ngOnDestroy() {
    this.logsService.stopConnection();
  }

  loggin() {
    this.log$.subscribe((line) => {
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

  private parseLine(line: string): [number, IAction] {
    const a: IAction = {} as IAction;

    a.number = this.lineNumber++;

    const logMatchArray = line.match(this.logRegExr);

    a.date = new Date(logMatchArray[2]);
    a.level = logMatchArray[3] as LogLevel;
    a.body = logMatchArray[4];

    const step = parseInt(logMatchArray[1], 10);

    return [step, a];
  }

  private appendLog(step: number, a: IAction) {
    if (!this.buildSteps.has(step)) {
      this.buildSteps.set(step, [false, []]);
    }

    this.buildSteps.get(step)[1].push(a);
  }

  // Temporary solution for converting logs to existing format
  private formatLog(line: string) {
    const log = JSON.parse(line);
    const logString = `[${this.step++} ${log.Timestamp} INF] ${log.Message}`;
    this.rawLogs.push(logString);
    return logString;
  }

  formatExistingLog(log: IProjectLog) {
    const logString = `[${this.step++} ${log.timestamp} INF] ${log.message}`;
    this.rawLogs.push(logString);
    return logString;
  }

  scrollTop(el: HTMLElement) {
    el.scrollIntoView(true);
    window.scrollBy(0, -75);
  }

  scrollBottom(el: HTMLElement) {
    el.scrollIntoView(true);
  }
  openRaw() {
    localStorage.setItem('logs', JSON.stringify(this.rawLogs));
    window.open('/logs', '_blank');
  }
}
