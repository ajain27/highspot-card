import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, pluck, switchMap, tap} from 'rxjs/operators';
import { SearchService } from '../service/search.service';
import { CardData } from '../models/Card';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, AfterViewInit {

  public searchPageNumber: number;
  public cards: CardData;
  public showSpinner: boolean;
  public searchResults: Array<CardData>;
  public numberOfCards: number;
  public viewCards: boolean;
  public cardTtitle: string;
  public notEmptyCard = true;
  public notScrollY = true;
  public pageNumber = 1;

  @ViewChild('searchForm') searchForm: NgForm;

  constructor(private _searchService: SearchService,
    private spinner: NgxSpinnerService) {
    this.viewCards = false;
    this.searchPageNumber = 0;
    this.searchResults = [];
  }

  ngOnInit() {  }

  ngAfterViewInit(): void {
    this.getCards();
  }

  public getCards(): void {
    // getting the typed value in the textbox as a observable
    const formValue = this.searchForm.valueChanges;
    formValue.pipe(
      // used to use a property from the observable
      pluck('search'),
      // start spinner
      tap(() => this.showSpinner = true),
      // wait for 1 second
      debounceTime(1000),
      // will not make an API call if search term isnt changed
      distinctUntilChanged(),
      // will cancel the previous calls if search term is changed with in the debounce time - performance enhancement
      switchMap(res => this._searchService.getSearchResults(res)),
      // stop the spinner once the API call has been made
      tap(() => this.showSpinner = false)
    ).subscribe(res => {
      this.searchResults = res.cards;
      this.viewCards = true;
      this.numberOfCards = this.searchResults.length;
      this.cardTtitle = this.numberOfCards === 1 ? 'card' : ' cards';
    });
  }
  public trackByIdx(i: any) {
    return i;
  }

  public onScroll(): void {
    if (this.notEmptyCard && this.notScrollY) {
      this.spinner.show();
      this.notScrollY = false;
      this.loadNewCards();
    }
  }

  public getNewCards(): void {
    this.pageNumber++;
    this._searchService.loadCards(this.pageNumber).subscribe(newCards => {
      const newCardsReturned = newCards && newCards.cards ? newCards.cards : null;
      this.spinner.hide();
      if (newCardsReturned === 0) {
        this.notEmptyCard = false;
      }
      this.searchResults = this.searchResults.concat(newCardsReturned);
      this.numberOfCards = this.searchResults.length;
      this.cardTtitle = this.numberOfCards === 1 ? 'card' : ' cards';
      this.notScrollY = true;
    });
  }

  public loadNewCards() {
    setTimeout((): void => {
      this.getNewCards();
    }, 2000);
  }
}
