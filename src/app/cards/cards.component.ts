import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, mergeMap, pluck, scan, switchMap, tap, throttle, throttleTime } from 'rxjs/operators';
import { SearchService } from '../service/search.service';
import { CardData } from '../models/Card';
// import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { BehaviorSubject, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';


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
  public pageSize = 20;

  public notEmptyCard = true;
  public notScrollY = true;
  public pageNumber = 1;

  @ViewChild('searchForm') searchForm: NgForm;
  // @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  constructor(private _searchService: SearchService,
    private spinner: NgxSpinnerService,
    private _http: HttpClient) {
    this.viewCards = false;
    this.searchPageNumber = 0;
    this.searchResults = [];
  }

  ngOnInit() {
    // this.nextSearchPage(this.searchPageNumber);
  }

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
  public trackByIdx(i) {
    return i;
  }

  public onScroll() {
    if (this.notEmptyCard && this.notScrollY) {
      this.spinner.show();
      this.notScrollY = false;
      this.loadNewCards();
    }
  }

  public getNewCards() {
    this.pageNumber++;
    this._searchService.getCards(this.pageNumber).subscribe(newCards => {
      const newCardsReturned = newCards.cards;
      this.spinner.hide();
      if (newCardsReturned === 0) {
        this.notEmptyCard = false;
      }
      this.searchResults = this.searchResults.concat(newCardsReturned);
      this.notScrollY = true;
    });
  }

  public loadNewCards() {
    setTimeout((): void => {
      this.getNewCards();
    }, 2000);
  }
}
