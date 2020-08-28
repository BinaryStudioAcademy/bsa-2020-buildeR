import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Group } from '../../shared/models/group/group';
import { Observable } from 'rxjs';
import { ProjectInfo } from '../../shared/models/project-info';
import { HttpResponse } from '@angular/common/http';
import { TeamMember } from '../../shared/models/group/team-member';
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
  public getProjectsByGroup(
    groupId: number
  ): Observable<HttpResponse<ProjectInfo[]>> {
    return this.httpService.getFullRequest<ProjectInfo[]>(
      `${this.routePrefix}/getProjectsByGroupId/${groupId}`
    );
  }
  public getMembersByGroup(
    groupId: number
  ): Observable<HttpResponse<TeamMember[]>> {
    return this.httpService.getFullRequest<TeamMember[]>(
      `${this.routePrefix}/getMembersByGroupId/${groupId}`
    );
  }
  createGroup(newGroup: NewGroup) {
    return this.httpService.postRequest<Group>(`${this.routePrefix}`, newGroup);
  }
  updateGroup(group: Group) {
    return this.httpService.putRequest<Group>(`${this.routePrefix}`, group);
  }

}
