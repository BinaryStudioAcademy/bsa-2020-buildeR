import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { User} from '../../shared/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private httpService: HttpService) { }

getUser() {
  return this.httpService.getFullRequest<User>('template');
}
getUserByToken(accessToken: string) {
  return this.httpService.getRequest<User>(environment.apiUrl + '/api/auth/', {token: accessToken});
}

}
