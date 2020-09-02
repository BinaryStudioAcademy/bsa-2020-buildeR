import {
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

export class SignalRHub {
  private hubConnection: HubConnection;
  private subscriptions$ = new Map<string, Subject<string>>();

  constructor(private url: string) {}

  public async start(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.url, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();
    return await this.hubConnection.start();
  }

  public listen(eventName: string): Subject<string> {
    if (this.subscriptions$.has(eventName)) {
      return this.subscriptions$.get(eventName);
    } else {
      const subscription$ = new Subject<string>();
      this.subscriptions$.set(eventName, subscription$);
      this.hubConnection.on(eventName, (data) => {
        this.subscriptions$.get(eventName).next(data);
      });
      return this.subscriptions$.get(eventName);
    }
  }

  public invoke(actionName: string, ...data: any[]): Promise<any> {
    return this.hubConnection.invoke(actionName, ...data);
  }

  public disconnect() {
    this.hubConnection.stop();
    this.subscriptions$.forEach((subject) => {
      subject.complete();
    });
    this.subscriptions$.clear();
  }
}
