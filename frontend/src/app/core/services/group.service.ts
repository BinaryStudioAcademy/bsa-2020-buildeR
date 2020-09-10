import { Injectable } from '@angular/core';
import { HttpService, Params } from './http.service';
import { Group } from '../../shared/models/group/group';
import { Subject } from 'rxjs';
import { ProjectInfo } from '../../shared/models/project-info';
import { TeamMember } from '../../shared/models/group/team-member';
import { NewGroup } from '@shared/models/group/new-group';
import { RemoveGroup } from '@shared/models/group/remove-group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  routePrefix = '/groups';
  groupName$ = new Subject<string>();
  groupIsPublic$ = new Subject<boolean>();
  groupName = this.groupName$.asObservable();
  groupIsPublic = this.groupIsPublic$.asObservable();
  userGroupsChanged = new Subject<boolean>();
  constructor(private httpService: HttpService) { }

  getGroupById(groupId: number) {
    return this.httpService.getRequest<Group>(`${this.routePrefix}/` + groupId);
  }
  getAllGroups() {
    return this.httpService.getRequest<Group[]>(this.routePrefix);
  }
  getUserGroups(userId: number) {
    return this.httpService.getRequest<Group[]>(`${this.routePrefix}/getGroupsByUserId/${userId}`);
  }
  deleteGroup(groupId: number) {
    return this.httpService.deleteFullRequest<Group>(`${this.routePrefix}/` + groupId);
  }
  deleteGroupWithNotification(object: RemoveGroup) {
    return this.httpService.deleteRequest<Group>(`${this.routePrefix}/`, object as unknown as Params);
  }
  getProjectsByGroup(groupId: number) {
    return this.httpService.getFullRequest<ProjectInfo[]>(
      `${this.routePrefix}/getProjectsByGroupId/${groupId}`
    );
  }
  getMembersByGroup(groupId: number) {
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

  changeGroupNameAndStatus(groupName: string, groupIsPublic: boolean) {
    this.userGroupsChanged.next();
    this.groupName$.next(groupName);
    this.groupIsPublic$.next(groupIsPublic);
  }
}
