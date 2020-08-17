import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class GithubSyncService {

  constructor(private httpService: HttpService) { }


}
