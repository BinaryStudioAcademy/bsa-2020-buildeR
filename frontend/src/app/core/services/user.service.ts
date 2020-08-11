import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { User} from '../../shared/models/user';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Project } from '@shared/models/project/project';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private httpService: HttpService) { }

getUser() {
  return this.httpService.getFullRequest<User>('template');
}
getCurrentUser() {
  return this.httpService.getRequest<User>(environment.apiUrl + '/auth/');
}

createUser(user: User): Observable<HttpResponse<User>> {
  return this.httpService.postFullRequest<User>(environment.apiUrl + '/users', user);
}

}
