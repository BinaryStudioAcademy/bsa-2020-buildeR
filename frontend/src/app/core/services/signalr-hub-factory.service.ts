import { Injectable, OnDestroy } from '@angular/core';
import { SignalRHub } from '../models/signalr-hub';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalRHubFactoryService implements OnDestroy {
  private hubLookup = new Map<string, SignalRHub>();

  createHub(hubUrl: string): SignalRHub {
    if (this.hubLookup.has(hubUrl)) {
      return this.hubLookup.get(hubUrl);
    }

    const hub = new SignalRHub(this.buildUrl(hubUrl));
    this.hubLookup.set(hubUrl, hub);
    return hub;
  }

  disconnect() {
    this.hubLookup.forEach((hub) => hub.disconnect());
    this.hubLookup.clear();
  }

  ngOnDestroy() {
    this.disconnect();
  }

  private buildUrl(hubUrl: string) {
    return environment.signalRUrl + hubUrl;
  }
}
