import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ProjectLogsService } from '@core/services/projects-logs.service';

@Component({
  templateUrl: './raw-logs.component.html',
  styleUrls: ['./raw-logs.component.sass']
})
export class RawLogsComponent extends BaseComponent implements OnInit {

  logs: string[];
  constructor(private logsService: ProjectLogsService) {
    super();
  }

  ngOnInit(): void {
    this.logs = JSON.parse(localStorage.getItem('logs'));
    localStorage.removeItem('logs');
  }

}
