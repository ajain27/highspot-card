import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardData } from '../models/Card';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  url = "https://api.elderscrollslegends.io/v1/cards";

  constructor(private _http: HttpClient) { }

  public getSearchResults(name): Observable<any> {
    return this._http.get<any>(this.url, { params: new HttpParams().set('name', name) });
  }
}
