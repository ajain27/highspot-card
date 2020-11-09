import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  url = 'https://api.elderscrollslegends.io/v1/cards';

  constructor(private _http: HttpClient) { }

  public getSearchResults(name): Observable<any> {
    let params = new HttpParams();
    params = params.append('name', name);
    params = params.append('pageSize', '20');
    return this._http.get<any>(this.url, { params: params});
  }

  public getCards(pageNumber): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', pageNumber);
    params = params.append('pageSize', '20');
    return this._http.get<any>(this.url, { params: params});
  }
}
