import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Group } from '../../shared/models/group/group';
import { Observable } from 'rxjs';
import { NewGroup } from '@shared/models/group/new-group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  routePrefix = '/groups';
  constructor(private httpService: HttpService) { }

  getGroupById(groupId: number): Observable<Group> {
    return this.httpService.getRequest<Group>(`${this.routePrefix}/` + groupId);
  }
  getAllGroups(): Observable<Group[]> {
    return this.httpService.getRequest<Group[]>(this.routePrefix);
  }
  deleteGroup(groupId: number) {
    return this.httpService.deleteFullRequest<Group>(`${this.routePrefix}/` + groupId);
  }
  createGroup(newGroup: NewGroup) {
    return this.httpService.postRequest<Group>(`${this.routePrefix}`, newGroup);
  }

}
