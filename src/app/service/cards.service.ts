import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private _http: HttpClient) { }

  public getCards(): Observable<any> {
    return this._http.get('https://api.elderscrollslegends.io/v1/cards');
  }
}
