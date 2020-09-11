import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Repository } from '@core/models/Repository';
import { BuildHistory } from '@shared/models/build-history';

@Component({
  selector: 'app-build-history-card',
  templateUrl: './build-history-card.component.html',
  styleUrls: ['./build-history-card.component.sass']
})
export class BuildHistoryCardComponent implements OnInit {
  @Input() build: BuildHistory;
  @Input() repository: Repository;

  constructor() { }

  ngOnInit(): void {
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? '—';
  }
}
