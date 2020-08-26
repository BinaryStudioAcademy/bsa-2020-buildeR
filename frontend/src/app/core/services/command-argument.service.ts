import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CommandArgumentService {

  public routePrefix = '/commandArguments';

  constructor(private httpService: HttpService) { }


  removeCommandArgument(id: number) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${id}`);
  }
}
