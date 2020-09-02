import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TeamMember } from '../../shared/models/group/team-member';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  routePrefix = '/teamMembers';

  constructor(private httpService: HttpService) { }
  createMember(teamMember: TeamMember) {
    return this.httpService.postRequest<TeamMember>(`${this.routePrefix}`, teamMember);
  }
  updateMember(teamMember: TeamMember) {
    return this.httpService.putRequest<TeamMember>(`${this.routePrefix}`, teamMember);
  }
}
