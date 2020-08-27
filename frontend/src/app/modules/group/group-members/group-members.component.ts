import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../core/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { TeamMember } from '../../../shared/models/group/team-member';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.sass']
})
export class GroupMembersComponent implements OnInit {
  groupId: number;
  members: TeamMember[];
  constructor(private groupService: GroupService, private route: ActivatedRoute) {
    route.parent.params.subscribe(
      (params) => this.groupId = params.groupId);
  }

  ngOnInit(): void {
    this.getGroupMembers(this.groupId);
  }
  getGroupMembers(groupId: number) {
    this.groupService.getMembersByGroup(groupId).subscribe(res => this.members = res.body);
  }
}
