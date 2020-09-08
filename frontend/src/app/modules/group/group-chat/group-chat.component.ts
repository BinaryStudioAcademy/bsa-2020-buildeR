import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '@core/services/chat.service';
import { Message } from '@shared/models/message';
import { Subject } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';
import { HttpService } from '@core/services/http.service';
import { User } from '@shared/models/user/user';
import { Group } from '@shared/models/group/group';
import { TeamMember } from '@shared/models/group/team-member';
import { GroupService } from '@core/services/group.service';
import { BaseComponent } from '@core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.sass']
})
export class GroupChatComponent extends BaseComponent implements OnInit {

  user: User;
  groupId: number;
  group: Group;
  membersCount: number;
  message = new Subject<string>();
  @Input() textOfMessage = '';
  messages = new Array<Message>();

  constructor(private route: ActivatedRoute,
              private chat: ChatService,
              private auth: AuthenticationService,
              private groupService: GroupService) {
    super();
    this.route.parent.data.subscribe((data) => {
      this.groupId = data.group.id;
      });
    this.user = this.auth.getCurrentUser();
   }

  ngOnInit(): void {
    this.chat.buildConnection();
    this.chat.startConnectionAndJoinGroup(this.groupId.toString());
    this.chat.messageListener(this.message);
    this.message.subscribe((res) => {
      const msg: Message = JSON.parse(res);
      console.log(msg.createdAt)
      this.messages.push(msg);
    });
    this.getMessages();
    this.getMembersCount();
  }

  getMembersCount(){
    this.groupService.getMembersByGroup(this.groupId).pipe(takeUntil(this.unsubscribe$))
    .subscribe((res) => {
      this.membersCount = res.body.length;
    });
  }

  getMessages(){
    this.chat.getChatMessages(this.groupId).pipe(takeUntil(this.unsubscribe$))
    .subscribe((res) => {
      this.messages = res;
    });
  }

  sendMessage(){
    const msg = new Message();
    console.log(this.textOfMessage);
    msg.text = this.textOfMessage;
    msg.groupId = this.groupId;
    msg.senderId = this.user.id;
    this.chat.sendMessage(msg).subscribe((res) => console.log());
    this.textOfMessage = '';
  }
}
