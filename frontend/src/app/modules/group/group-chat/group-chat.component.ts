import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '@core/services/chat.service';
import { Message } from '@shared/models/message';
import { Subject, pipe } from 'rxjs';
import { ChatHubService } from '@core/services/chat-hub.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { Group } from '@shared/models/group/group';
import { GroupService } from '@core/services/group.service';
import { BaseComponent } from '@core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.sass']
})
export class GroupChatComponent extends BaseComponent implements OnInit, AfterViewChecked {

  user: User;
  groupId: number;
  group: Group;
  membersCount: number;
  message = new Subject<string>();
  @Input() textOfMessage = '';
  messages = new Array<Message>();
  @ViewChild('bottom') private bottom: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private chat: ChatService,
    private chatHub: ChatHubService,
    private auth: AuthenticationService,
    private groupService: GroupService
  ) {
    super();
  }
  ngAfterViewChecked(): void {
    this.scrollBottom();
  }

  ngOnInit(): void {
    this.route.parent.data.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.groupId = data.group.id;
    });
    this.user = this.auth.getCurrentUser();
    this.chatHub.buildConnection();
    this.chatHub.startConnectionAndJoinGroup(this.groupId.toString());
    this.chatHub.messageListener(this.message);
    this.message.pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        const msg: Message = JSON.parse(res);
        this.messages.push(msg);
        this.scrollBottom();
      });
    this.getMessages();
    this.getMembersCount();
  }

  getMembersCount() {
    this.groupService.getMembersByGroup(this.groupId).pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.membersCount = res.body.length;
      });

  }

  getMessages() {
    this.chat.getChatMessages(this.groupId).pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.messages = res;
      });
  }

  sendMessage() {
    if (this.textOfMessage === '') {
      return;
    }

    const createTime = new Date();
    createTime.setHours(createTime.getHours() - 3);

    const message = {
      text: this.textOfMessage,
      groupId: this.groupId,
      senderId: this.user.id,
      createdAt: createTime
    } as Message;
    this.chat.sendMessage(message).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => { });
    this.textOfMessage = '';
  }

  scrollBottom(el: HTMLElement = this.bottom.nativeElement) {
    el.scrollIntoView();
  }
}
