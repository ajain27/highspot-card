import { Component, OnInit } from '@angular/core';
import { CardsService } from '../service/cards.service';
import { CardData } from '../models/Card';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  constructor(private _cardService: CardsService) { }

  public cards: CardData;
  public showSpinner: boolean;

  ngOnInit() {
    this.getCards();
  }

  public getCards(): any {
    this.showSpinner = true;
    setTimeout(() => {
      this._cardService.getCards().subscribe(res => {
        this.cards = res.cards.slice(0, 20);
        console.log(this.cards);
        this.showSpinner = false;
      });
    }, 2000);
    
  }
}
