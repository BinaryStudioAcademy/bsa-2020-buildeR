import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { CommandArgument } from '@shared/models/command-argument';

@Injectable({
  providedIn: 'root'
})
export class CommandArgumentService {
  private routePrefix = '/commandArguments';

  constructor(private httpService: HttpService) { }

  removeCommandArgument(id: number) {
    return this.httpService.deleteRequest(`${this.routePrefix}/${id}`);
  }

  updateCommandArgument(commandArgument: CommandArgument) {
    return this.httpService.putRequest<CommandArgument>(`${this.routePrefix}`, commandArgument);
  }
}
