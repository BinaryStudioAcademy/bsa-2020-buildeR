import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImgageHeaderService {
  private subject = new Subject<string>();
  url = this.subject.asObservable();
  constructor() { }

  changeUrl(url: string){
    this.subject.next(url);
  }

}
