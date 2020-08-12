import { Injectable } from '@angular/core';
import { HttpService } from '@core/services/http.service';
import { User } from '@shared/models/user/user';
@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  url = '/settings/user';
  constructor(private httpService: HttpService) { }

  getSettings(id: number){
    return this.httpService.getFullRequest(this.url);
  }

  createSettings(settings: User){
    return this.httpService.postFullRequest(this.url, settings);
  }

  updateSettings(settings: User){
    return this.httpService.putFullRequest(this.url, settings);
  }

  deleteSettings(id: number){
    return this.httpService.deleteFullRequest(this.url, id);
  }
}
