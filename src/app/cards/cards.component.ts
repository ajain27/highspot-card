import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, mergeMap, pluck, scan, switchMap, tap, throttle, throttleTime } from 'rxjs/operators';
import { SearchService } from '../service/search.service';
import { CardData } from '../models/Card';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { BehaviorSubject, of } from 'rxjs';

const batchSize = 20;

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, AfterViewInit {

  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  searchPageNumber: number;
  constructor(private _searchService: SearchService) { 
    this.viewCards = false;
  }
  public cards: CardData;
  public showSpinner: boolean;
  public searchResults: Array<CardData>;
  public cardsLength: number;
  public viewCards: boolean;  
  public cardsText: string;

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
      this.cardsLength = this.searchResults.length
      if(this.cardsLength === 1) {
        this.cardsText = "card"
      } else {
        this.cardsText = "cards";
      }
    })
  }
  public trackByIdx(i) {
    return i;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let currentPositionOfScroll = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let maxHeightOfWindow = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    this.getCards();
  }
}
