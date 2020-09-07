import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '@core/services/chat.service';
import { Message } from '@shared/models/message';
import { Subject } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';
import { HttpService } from '@core/services/http.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.sass']
})
export class GroupChatComponent implements OnInit {

  userId: number;
  groupId: number;
  message = new Subject<Message>();
  textOfMessage = '';

  constructor(private route: ActivatedRoute,
              private chat: ChatService,
              private auth: AuthenticationService) {
    this.route.parent.data.subscribe((data) => {
      this.groupId = data.group.id;
      });
    this.userId = this.auth.getCurrentUser().id;
   }

  ngOnInit(): void {
    this.chat.buildConnection();
    this.chat.startConnectionAndJoinGroup(this.groupId.toString());
    this.chat.messageListener(this.message);
    this.message.subscribe((res) => {
      console.log(res);
    });
  }

  sendMessage(){
    const msg = new Message();
    console.log(this.textOfMessage);
    msg.text = this.textOfMessage;
    msg.creteAt = new Date(Date.now());
    msg.groupId = this.groupId;
    msg.senderId = this.userId;
    this.chat.sendMessage(msg).subscribe((res) => console.log(res));
  }
}
