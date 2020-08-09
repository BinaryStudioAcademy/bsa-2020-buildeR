import { Component, OnInit } from '@angular/core';
import { SignalRService} from '@core/services/signal-r.service';
import { HttpService } from '@core/services/http.service';


@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.sass']
})
export class WorkSpaceComponent implements OnInit {

  constructor(private signalR: SignalRService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.signalR.signalRecieved.subscribe(() => {
      console.log('received');
    });
  }

  broadcast(){
    this.httpService.getFullRequest('http://localhost:5070/api')
    .subscribe((res) => console.log(res));
  }
}
