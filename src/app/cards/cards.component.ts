import { Component, OnInit } from '@angular/core';
import { CardsService } from '../service/cards.service';
import { CardData } from '../models/Card';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  constructor(private _cardService: CardsService) { 
  }

  public cards: CardData;
  public showSpinner: boolean;
  private _itemsToLoadInitially: number = 20;
  private _cardsToLoad: number = 20;
  public page: number = 1;
  public searchText: any = '';

  ngOnInit() {
    this.getCards();
  }

  public getCards(): any {
    this.showSpinner = true;
    setTimeout(() => {
      this._cardService.getCards().subscribe(res => {
        console.log(res.cards.length);
        this.cards = res.cards.slice(0, this._itemsToLoadInitially);
        console.log(this.cards);
        this.showSpinner = false;
      });
    }, 2000);
  }

  public onScroll() {
    this._cardService.getCards().subscribe(cards => {
      if(this._itemsToLoadInitially <= cards.length) {
        this._itemsToLoadInitially += this._cardsToLoad;
        this.cards = cards.slice(0, this._itemsToLoadInitially);
      }
    })
    this.getCards();  
  }

  public gettingFilteredResults(e: Event): void {
    this.searchText = e;
  }
}
