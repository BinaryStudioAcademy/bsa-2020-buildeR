import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-big',
  templateUrl: './chart-big.component.html',
  styleUrls: ['./chart-big.component.sass']
})
export class ChartBigComponent implements OnInit {

  @Input() data;
  // Mock
  multi = [
    {
      name: '26.02',
      series: [
        {
          name: 'Succeed',
          value: 73
        },
        {
          name: 'Faild',
          value: 89
        },
        {
          name: 'Errored',
          value: 63
        },
        {
          name: 'Canceled',
          value: 12
        }
      ]
    },

    {
      name: '27.02',
      series: [
        {
          name: 'Succeed',
          value: 70
        },
        {
          name: 'Faild',
          value: 61
        },
        {
          name: 'Errored',
          value: 11
        },
        {
          name: 'Canceled',
          value: 12
        }
      ]
    },
    {
      name: '28.02',
      series: [
        {
          name: 'Succeed',
          value: 73
        },
        {
          name: 'Faild',
          value: 28
        },
        {
          name: 'Errored',
          value: 61
        },
        {
          name: 'Canceled',
          value: 53
        }
      ]
    },
    {
      name: '29.02',
      series: [
        {
          name: 'Succeed',
          value: 25
        },
        {
          name: 'Faild',
          value: 48
        },
        {
          name: 'Errored',
          value: 31
        },
        {
          name: 'Canceled',
          value: 13
        }
      ]
    }
  ];

  view = [window.innerWidth - 300, 300];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = 'Build Statuses';
  legendTitle = 'Statuses';

  colorScheme = {
    domain: ['#34ab53', '#d84848', '#ecdb43', '#9d9d9d']
  };

  constructor() {
    if (window.innerWidth < 400){
      this.view = [window.innerWidth - 50, 300];
      this.showYAxisLabel = true;
    }
    else{
      this.view = [window.innerWidth - 300, 300];
      this.showYAxisLabel = true;
    }
  }
  ngOnInit(): void {

    window.onresize = () => {
    if (window.innerWidth < 400){
      this.view = [window.innerWidth - 50, 300];
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
