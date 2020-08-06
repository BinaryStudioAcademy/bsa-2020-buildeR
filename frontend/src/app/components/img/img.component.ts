import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.sass']
})
export class ImgComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  public upload(event: any): void {
    const file = event.target.files[0];
    const data = new FormData();
    data.append('file', file, file.name);
    this.http.post('http://localhost:5050/api/ImageUpload', data)
    .pipe(
      map(res => console.log('got response', res),
      catchError(error => of(console.error('got error', error)))))
      .subscribe(() => console.log('next'), error => console.log(error));
  }

}