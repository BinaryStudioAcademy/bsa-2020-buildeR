import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-small',
  templateUrl: './chart-small.component.html',
  styleUrls: ['./chart-small.component.sass']
})
export class ChartSmallComponent implements OnInit {
  view = [250, 75];
  // options
  @Input() results;
  legend  = false;
  showLabels = false;
  animations = true;
  timeline = false;
  xAxis = false;
  yAxis = false;
  showYAxisLabel = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  yAxisLabel = '';
//   results = [
//   {
//     name: 'Active',
//     series: [
//       {
//         name: '1986',
//         value: 0
//       },
//       {
//         name: '1987',
//         value: 0
//       },
//       {
//         name: '1988',
//         value: 1
//       },
//       {
//         name: '1989',
//         value: 0
//       },
//       {
//         name: '1990',
//         value: 0
//       },
//       {
//         name: '1991',
//         value: 0
//       },
//       {
//         name: '1992',
//         value: 0
//       },
//       {
//         name: '1993',
//         value: 1
//       },

//       {
//         name: '1994',
//         value: 0
//       }
//     ]
//   },

// ];

  colorScheme = {
    domain: ['#C5BEBE' ]
  };

  constructor() {
  }
  ngOnInit(): void {
  }

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
