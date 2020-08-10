import { Injectable } from '@angular/core';
import { HttpService } from '@core/services/http.service';
import { User } from '@shared/models/user';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  url = '/users/';
  imageStorageUrl = '/api/FileStorage/';
  constructor(private httpService: HttpService) { }

  getSettings(id: number){
    return this.httpService.getFullRequest(this.url);
  }

  createSettings(settings: User){
    return this.httpService.postRequest(this.url, settings);
  }

  updateSettings(settings: User){
    return this.httpService.putRequest<User>(this.url , settings);
  }

  deleteSettings(id: number){
    return this.httpService.deleteFullRequest(this.url, id);
  }

  uploadImage(formData: FormData) {
    return this.httpService.postRequest<string>(this.imageStorageUrl, formData);
  }
}
