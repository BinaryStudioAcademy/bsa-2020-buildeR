import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuildPluginService {

  public routePrefix = '/buildPlugins';

  constructor(private httpService: HttpService) { }

  getVersionsOfBuildPlugin(buildPluginName: string, partOfVersionTerm: string): Observable<HttpResponse<string[]>> {
    return this.httpService.getFullRequest<string[]>(`${this.routePrefix}/${buildPluginName}/versions/${partOfVersionTerm}`);
  }

  versionsLookup(buildPluginName: string, partOfVersionTerm: string): Observable<any> {
    return this.httpService.getRequest<string[]>(`${this.routePrefix}/${buildPluginName}/versions/${partOfVersionTerm}`);
}
}
