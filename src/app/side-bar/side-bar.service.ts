import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  isOpened = new BehaviorSubject(true);
  keepOpen = new BehaviorSubject(true);
  suggestions = new BehaviorSubject(false);
  drag = new Subject<boolean>();
  constructor() {}

  sideBarToggle(condition: boolean) {
    if (condition) {
      setTimeout(() => {
        this.isOpened.next(condition);
      }, 200);
    } else {
      this.isOpened.next(condition);
    }
  }
  keepOpenToggle(condition: boolean) {
    this.keepOpen.next(condition);
  }
  suggestionsToggle(condition: boolean) {
    this.suggestions.next(condition);
  }
}
