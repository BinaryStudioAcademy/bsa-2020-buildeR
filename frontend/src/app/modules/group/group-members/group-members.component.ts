import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../core/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { TeamMember } from '../../../shared/models/group/team-member';
import { UserRole } from '../../../shared/models/group/user-role';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UserInfo } from 'os';
import { User } from '../../../shared/models/user/user';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.sass']
})
export class GroupMembersComponent implements OnInit {
  groupId: number;
  model: any;
  members: TeamMember[];
  users: User[];
  userRole: typeof UserRole = UserRole;
  constructor(private groupService: GroupService, private route: ActivatedRoute, private userService: UserService) {
    route.parent.params.subscribe(
      (params) => this.groupId = params.groupId);
  }

  ngOnInit(): void {
    this.getGroupMembers(this.groupId);
    this.getUsers();
  }
  getGroupMembers(groupId: number) {
    this.groupService.getMembersByGroup(groupId).subscribe(res => this.members = res.body);
  }
  getUsers() {
    this.userService.getUsers().subscribe(res => this.users = res.body);
  }


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.users.filter(v => v.username.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.email.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  formatter = (x: { username: string }) => x.username;
}
