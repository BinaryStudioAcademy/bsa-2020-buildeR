import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '@env/../environments/environment';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public hubConnetction: signalR.HubConnection;
  signalRecieved: Subject<string> = new Subject<string>();
  constructor() {
    this.buildConnection();
    this.startConnection();
  }

  public buildConnection(hubUrl: string = '/testhub') {
    this.hubConnetction =  new signalR.HubConnectionBuilder()
    .withUrl(this.buildUrl(hubUrl))
    .build();
  }

  public startConnection(){
    this.hubConnetction.start()
    .then(() => {
      this.registerSignalREvents();
  })
    .catch((err) => {
      console.error('error connection: ' + err);
    });
  }

  private registerSignalREvents(method: string = 'Send'){
    this.hubConnetction.on(method, (result) => {
      console.log(result);
      this.signalRecieved.next();
    });
  }

  private buildUrl(hubUrl: string): string{
    return environment.signalRUrl + hubUrl;
  }
}