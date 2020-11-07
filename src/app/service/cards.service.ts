import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class CardsService {
  private cards = 'https://api.elderscrollslegends.io/v1/cards';
  
  constructor(private _http: HttpClient) { }

  public getCards(): Observable<any> {
    return this._http.get(this.cards);
  }
}
