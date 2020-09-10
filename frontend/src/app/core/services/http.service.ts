import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseUrl: string = environment.apiUrl;
  headers = new HttpHeaders();

  constructor(private readonly http: HttpClient) { }
  getHeaders() {
    return this.headers;
  }

  getHeader(key: string) {
    return this.headers[key];
  }

  setHeader(key: string, value: string) {
    this.headers = this.headers.set(key, value);
  }

  deleteHeader(key: string) {
    this.headers.delete(key);
  }

  getRequest<T>(url: string, httpParams?: HttpParams) {
    return this.http.get<T>(this.buildUrl(url), {
      headers: this.getHeaders(),
      params: httpParams,
    });
  }

  getFullRequest<T>(
    url: string,
    httpParams?: HttpParams
  ) {
    return this.http.get<T>(this.buildUrl(url), {
      observe: 'response',
      headers: this.getHeaders(),
      params: httpParams,
    });
  }

  postClearRequest<T>(url: string, payload: object) {
    return this.http.post<T>(this.buildUrl(url), payload);
  }

  postRequest<T>(url: string, payload: object) {
    return this.http.post<T>(this.buildUrl(url), payload, {
      headers: this.getHeaders(),
    });
  }

  postFullRequest<T>(
    url: string,
    payload: object
  ) {
    return this.http.post<T>(this.buildUrl(url), payload, {
      headers: this.getHeaders(),
      observe: 'response',
    });
  }

  putRequest<T>(url: string, payload: object) {
    return this.http.put<T>(this.buildUrl(url), payload, {
      headers: this.getHeaders(),
    });
  }

  putFullRequest<T>(url: string, payload: object) {
    return this.http.put<T>(this.buildUrl(url), payload, {
      headers: this.getHeaders(),
      observe: 'response',
    });
  }

  deleteRequest<T>(url: string, httpParams?: HttpParams) {
    return this.http.delete<T>(this.buildUrl(url), {
      headers: this.getHeaders(),
      params: httpParams,
    });
  }

  deleteFullRequest<T>(
    url: string,
    httpParams?: HttpParams
  ) {
    return this.http.delete<T>(this.buildUrl(url), {
      headers: this.getHeaders(),
      observe: 'response',
      params: httpParams,
    });
  }

  buildUrl(url: string) {
    return /^https?:\/\/.+/.test(url) ? url : this.baseUrl.concat(url);
  }
}
