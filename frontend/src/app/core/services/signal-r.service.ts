import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnetction: signalR.HubConnection;

  constructor() {
    this.buildConnection();

  }

  public buildConnection() {
    this.hubConnetction =  new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5070/testhub')
    .build();
  }

  public startConnection(){
    this.hubConnetction.start()
    .then(() => console.log('connection started'))
    .catch((err) => {
      console.error('error connection: ' + err);
    });

    setTimeout(function() {this.startConnection(); }, 3000);
  }
}
