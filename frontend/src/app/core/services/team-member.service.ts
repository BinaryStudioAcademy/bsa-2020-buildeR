import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TeamMember } from '../../shared/models/group/team-member';
import { RemoveTeamMember } from '@shared/models/group/remove-team-member';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  routePrefix = '/teamMembers';
  teamMembersChanged = new Subject<boolean>();

  constructor(private httpService: HttpService) { }
  createMember(teamMember: TeamMember) {
    return this.httpService.postRequest<TeamMember>(`${this.routePrefix}`, teamMember);
  }
  updateMember(teamMember: TeamMember) {
    return this.httpService.putRequest<TeamMember>(`${this.routePrefix}`, teamMember);
  }
  deleteMember(memberId: number) {
    return this.httpService.deleteRequest<TeamMember>(`${this.routePrefix}/` + memberId);
  }
  deleteMemberWithNotification(object: RemoveTeamMember) {
    return this.httpService.deleteRequest<TeamMember>(`${this.routePrefix}/`, object);
  }
}
