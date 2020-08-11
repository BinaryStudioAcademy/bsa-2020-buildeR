import {
  Component,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BuildLogService } from '../../services/build-log.service';

export type LogLevel = 'WRN' | 'ERR' | 'FTL' | 'INF' | 'DBG' | 'VRB';

type Action = {
  buildStep: number;
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
  implements AfterViewInit {
  private logRegExr = /^\[(\d+) (.+) (\w+)\](.*)/;

  private lineNumber: number = 1;

  showLevels: boolean = false;
  showTimeStamps: boolean = false;

  actions: Action[] = [];

  constructor(private buildService: BuildLogService) {
    super();
  }

  ngAfterViewInit(): void {
    this.buildService
      .getTestBuildLog()
      .subscribe((line) => this.buildLog(line));
  }

  clear() {
    this.actions = [];
    this.lineNumber = 1;
  }

  private buildLog(line: string) {
    this.appendBuildStep(this.parseLine(line));
  }

  private parseLine(line: string): Action {
    const a: Action = {} as Action;

    a.number = this.lineNumber++;

    const logMatchArray = line.match(this.logRegExr);

    a.buildStep = parseInt(logMatchArray[1]);
    a.date = new Date(logMatchArray[2]);
    a.level = logMatchArray[3] as LogLevel;
    a.body = logMatchArray[4];

    a.expanded = true;

    return a;
  }

  private appendBuildStep(a: Action) {
    this.actions.push(a);
  }
}
