import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UserRole } from '../../shared/models/group/user-role';
import { TeamMember } from '../../shared/models/group/team-member';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  routePrefix = '/teamMembers';

  constructor(private httpService: HttpService) { }

  updateMember(teamMember: TeamMember) {
    return this.httpService.putRequest<TeamMember>(`${this.routePrefix}`, teamMember);
  }
}
