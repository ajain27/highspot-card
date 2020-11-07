import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, pluck, switchMap, tap } from 'rxjs/operators';
import { SearchService } from '../service/search.service';
import { CardData } from '../models/Card';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, AfterViewInit {

  @ViewChild('searchForm') searchForm: NgForm;
  
  constructor(private _searchService: SearchService) { }

  public cards: CardData;
  public showSpinner: boolean;
  public searchResults: CardData;
  // private _itemsToLoadInitially: number = 20;
  // private _cardsToLoad: number = 20;
  // public page: number = 1;
  // public searchResult: any = '';

  ngOnInit() { }

  ngAfterViewInit(): void {
      this.getCards();    
  }

  public getCards() {
    // getting the typed value in the textbox as a observable
    const formValue = this.searchForm.valueChanges;
    formValue.pipe(
      // used to use a property from the observable
      pluck('search'),
      // start spinner
      tap(()=> this.showSpinner = true),
      // wait for 1 second
      debounceTime(1000),
      // will not make an API call if search term isnt changed
      distinctUntilChanged(),
      // will cancel the previous calls if search term is changed with in the debounce time - performance enhancement
      switchMap(res => this._searchService.getSearchResults(res)),
      // stop the spinner once the API call has been made 
      tap(()=> this.showSpinner = false)
    ).subscribe(res => {
      this.searchResults = res.cards;
    })
  }

  // public onScroll() {
  //   this._cardService.getCards().subscribe(cards => {
  //     if(this._itemsToLoadInitially <= cards.length) {
  //       this._itemsToLoadInitially += this._cardsToLoad;
  //       this.cards = cards.slice(0, this._itemsToLoadInitially);
  //     }
  //   })
  //   this.getCards();  
  // }
}
