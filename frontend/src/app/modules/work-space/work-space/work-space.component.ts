import { Component, OnInit } from '@angular/core';
import { SignalRService} from '@core/services/signal-r.service';
import { HttpService } from '@core/services/http.service';
import { environment } from '@env/../environments/environment';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.sass']
})
export class WorkSpaceComponent implements OnInit {
  url = environment.signalRUrl + '/api';
  constructor(private signalR: SignalRService, private httpService: HttpService,
              private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.signalR.signalRecieved.subscribe(() => {
      alert('You just received a test broadcast');
    });
  }

  broadcast(){
    this.httpService.getFullRequest(this.url)
    .subscribe((res) => console.log(res));
  }
  logOut() {
    this.authService.logout();
  }

}
