import { Injectable } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  url = 'api/settings/user';
  imageStorageUrl = '/api/FileUpload/';
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

  uploadImage(formData: FormData) {
    return this.httpService.postRequest<string>(this.imageStorageUrl, formData);
  }

  getLastUploadedPhoto() {
    return this.httpService.getRequest<string>(this.imageStorageUrl);
  }

  getRootPath() {
    return this.httpService.getRequest<string>(this.imageStorageUrl + 'rootpath');
  }
}
