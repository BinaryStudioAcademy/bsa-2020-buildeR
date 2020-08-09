import { Component, OnInit } from '@angular/core';
import { SignalRService} from '@core/services/signal-r.service';
import { HttpService } from '@core/services/http.service';
import { environment } from '@env/../environments/environment';


@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.sass']
})
export class WorkSpaceComponent implements OnInit {
  url = environment.signalRUrl + '/api';
  constructor(private signalR: SignalRService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.signalR.signalRecieved.subscribe(() => {
      alert('You just received a test broadcast');
    });
  }

  broadcast(){
    this.httpService.getFullRequest(this.url)
    .subscribe((res) => console.log(res));
  }
}
