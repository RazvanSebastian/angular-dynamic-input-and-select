import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  VERSION,
  ViewChild
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  private filters = { tagFilter: '', sortingValue: 'ASC' };
  public sortingOptions = [
    { name: 'Ascending', value: 'ASC' },
    { name: 'Descending', value: 'DESC' }
  ];

  @ViewChild('tagFilter')
  tagFilter: ElementRef;

  public emitOnFiltersChanges(): void {
    console.log('Emit search with filters ', this.filters);
  }

  ngAfterViewInit(): void {
    fromEvent(this.tagFilter.nativeElement, 'keyup')
      .pipe(
        map(_ => this.tagFilter.nativeElement.value),
        debounceTime(500),
        distinctUntilChanged(
          (previous: string, current: string) =>
            previous.toLocaleLowerCase() === current.toLocaleLowerCase()
        ),
        tap(text => (this.filters.tagFilter = text))
      )
      .subscribe(_ => this.emitOnFiltersChanges());
  }

  public set sortingSelect(sortingValue: string) {
    this.filters.sortingValue = sortingValue;
    this.emitOnFiltersChanges();
  }

  public get sortingSelect(): string {
    return this.filters.sortingValue;
  }
}
