import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { UserSettings } from '../models/user-settings';
@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  url = 'api/settings/user';
  constructor(private httpService: HttpService) { }

  getSettings(id: number){
    return this.httpService.getFullRequest(this.url);
  }

  createSettings(settings: UserSettings){
    return this.httpService.postFullRequest(this.url, settings);
  }

  updateSettings(settings: UserSettings){
    return this.httpService.putFullRequest(this.url, settings);
  }

  deleteSettings(id: number){
    return this.httpService.deleteFullRequest(this.url, id);
  }
}
