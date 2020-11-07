import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() data: EventEmitter<string> = new EventEmitter();
  searchedText: any;

  constructor() { }

  ngOnInit() {
    this.searchedText = '';
  }

  public search(): any {
    setTimeout(() => {
      this.data.emit(this.searchedText);
      console.log(this.searchedText);
    });
  }
}
