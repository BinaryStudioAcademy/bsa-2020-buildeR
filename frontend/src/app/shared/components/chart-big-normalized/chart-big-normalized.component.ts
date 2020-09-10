import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-big-normalized',
  templateUrl: './chart-big-normalized.component.html',
  styleUrls: ['./chart-big-normalized.component.sass']
})
export class ChartBigNormalizedComponent implements OnInit {

  @Input() results;
  // Mock
  // results = [
  //   {
  //     name: '26.02',
  //     series: [
  //       {
  //         name: 'Succeed',
  //         value: 73
  //       },
  //       {
  //         name: 'Failed',
  //         value: 89
  //       },
  //       {
  //         name: 'Errored',
  //         value: 63
  //       },
  //       {
  //         name: 'Canceled',
  //         value: 12
  //       }
  //     ]
  //   },
  // ];

  view = [1100, 300];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  showYAxisLabel = false;
  yAxisLabel = '';
  legendTitle = 'Statuses';

  colorScheme = {
    domain: ['#34ab53', '#d84848', '#ecdb43', '#9d9d9d']
  };

  constructor() {

  }
  ngOnInit(): void {
    if (window.innerWidth < 520){
      this.view = [window.innerWidth - 50, 300];
      this.showYAxisLabel = true;
    }
    window.onresize = () => {
    if (window.innerWidth < 350){
      this.view = [280, 300];
      this.showYAxisLabel = false;
      return;
    }
    if (window.innerWidth < 650){
      this.view = [window.innerWidth - 50, 300];
      this.showYAxisLabel = false;
      return;
    }
    if (window.innerWidth > 1200){
      this.view = [1100, 300];
      this.showYAxisLabel = false;
    }
    else{
      this.view = [window.innerWidth - 300, 300];
      this.showYAxisLabel = true;
    }
  };
  }

 onSelect(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }
}
