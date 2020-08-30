import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SignalRHub {
  private hubConnection: HubConnection;
  private subscriptions$ = new Map<string, Subject<string>>();

  constructor(private url: string) {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection() {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.url).build();
  }

  public startConnection() {
    this.hubConnection
      .start()
      .catch((err) => {
        console.error('error connection: ' + err);
      });
  }

  public listen(eventName: string): Subject<string> {
    if (this.subscriptions$.has(eventName)) {
      return this.subscriptions$.get(eventName);
    } else {
      const subscription$ = new Subject<string>();
      this.subscriptions$.set(eventName, subscription$);
      this.hubConnection.on(eventName, (data) => {
        subscription$.next(data);
      });
      return subscription$;
    }
  }

  public async invoke(actionName: string, ...data: any[]): Promise<any> {
    return this.hubConnection.invoke(actionName, data);
  }

  public disconnect() {
    this.hubConnection.stop();
    this.subscriptions$.forEach((subject) => {
      subject.next();
      subject.complete();
    });
    this.subscriptions$.clear();
  }
}
