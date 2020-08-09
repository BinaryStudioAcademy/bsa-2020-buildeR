import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@aspnet/signalr';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public hubConnetction: signalR.HubConnection;
  signalRecieved: EventEmitter<string> = new EventEmitter<string>();
  constructor() {
    this.buildConnection();
    this.startConnection();
  }

  public buildConnection() {
    this.hubConnetction =  new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5070/testhub',
    {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
  })
    .build();
    console.log('built');
  }

  public startConnection(){
    this.hubConnetction.start()
    .then(() => {
      console.log('connection started');
      this.registerSignalREvents();
  })
    .catch((err) => {
      console.error('error connection: ' + err);
    });
  }

  private registerSignalREvents(){
    this.hubConnetction.on('Send', (result) => {
      console.log(result);
      this.signalRecieved.emit();
    });
  }
}
