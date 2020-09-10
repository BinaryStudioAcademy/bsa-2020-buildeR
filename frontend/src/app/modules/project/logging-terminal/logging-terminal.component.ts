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
import { ProjectLogsService } from '@core/services/projects-logs.service';
import { IProjectLog } from '@shared/models/project/project-log';
import { BuildHistory } from '@shared/models/build-history';
import { BuildStatus } from '@shared/models/build-status';

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
export class LoggingTerminalComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  @Input() isLive: boolean;
  @Input() set buildhistory(bh: BuildHistory) {
    this.buildHistory = bh;
    this.configureLogsSignalR();
  }
  @Input() set logs(values: IProjectLog[]) {
    this.writeStaticLogs(values);
  }

  private buildHistory: BuildHistory;

  private step = 1;
  private logRegExr = /^\[(\d+) (.+) (\w+)\](.*)/;

  @ViewChild('bottom') private bottom: ElementRef;
  rawLogs: string[] = [];
  autoscroll = true;
  private lineNumber = 1;
  showLevels = false;
  showTimeStamps = false;

  private lastScrollYPos = -1;

  buildSteps: Map<number, [boolean, IAction[]]>;

  constructor(private logsService: ProjectLogsService) {
    super();
    this.initLogs();
  }

  @HostListener('window:scroll', ['$event']) onScroll(_: Event) {
    const yPos = window.scrollY;
    if (yPos < this.lastScrollYPos) {
      this.autoscroll = false;
    }
    this.lastScrollYPos = yPos;
  }

  ngOnInit() {}

  private configureLogsSignalR() {
    if (this.buildHistory.buildStatus == BuildStatus.InProgress) {
      this.logsService.connect(this.buildHistory.id);
      this.logsService.listen(this.buildHistory.id).subscribe((message) => {
        this.buildLog(this.formatLog(message));
      });
    }
  }

  ngOnDestroy() {
    this.logsService.disconnect(this.buildHistory.id);
  }

  writeStaticLogs(logs: IProjectLog[]) {
    this.initLogs();
    logs?.forEach((log) => this.buildLog(this.formatExistingLog(log), false));
  }

  initLogs() {
    this.buildSteps = new Map<number, [boolean, IAction[]]>();
    this.rawLogs = [];
    this.lineNumber = 1;
  }

  setExpand(key: number) {
    this.buildSteps.get(key)[0] = !this.buildSteps.get(key)[0];
  }

  private buildLog(line: string, enableScroll: boolean = true) {
    if (enableScroll && this.autoscroll) {
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
