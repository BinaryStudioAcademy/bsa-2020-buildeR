import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../core/services/http.service';
import { User } from '../../shared/models/user/user';
import { NewUser } from '../../shared/models/user/new-user';
import { LinkProvider } from '../../shared/models/user/link-provider';
import { ValidateUser } from '@shared/models/user/validate-user';
import { HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public routePrefix = '/users';
  private userLogoUrl$ = new Subject<string>();
  userLogoUrl = this.userLogoUrl$.asObservable();

  constructor(private httpService: HttpService) { }

  getUser() {
    return this.httpService.getFullRequest<User>('template');
  }
  getCurrentUser() {
    return this.httpService.getRequest<User>(environment.apiUrl + '/auth/');
  }

  register(user: NewUser) {
    return this.httpService.postRequest<User>(`${this.routePrefix}`, user);
  }

  getUserById(userId: number) {
    return this.httpService.getRequest<User>(`${this.routePrefix}/${userId}`);
  }

  getUserByIdRequest(userId: number) {
    return this.httpService.getRequest<User>(`${this.routePrefix}/${userId}`);
  }

  login(uniqueId: string) {
    return this.httpService.getRequest<User>(`${this.routePrefix}/login/${uniqueId}`);
  }

  updateUser(user: User) {
    return this.httpService.putRequest<User>(`${this.routePrefix}`, user);
  }

  changeImageUrl(url: string) {
    this.userLogoUrl$.next(url);
  }

  validateUsername(user: ValidateUser): Observable<boolean> {
    return this.httpService.postRequest<boolean>(`${this.routePrefix}/validate-username`, user);
  }

  linkProvider(user: LinkProvider): Observable<User>
  {
    return this.httpService.postRequest<User>(`${this.routePrefix}/link-provider`, user);
  }
}
