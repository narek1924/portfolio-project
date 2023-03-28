import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  isOpened = new BehaviorSubject(false);
  keepOpen = new BehaviorSubject(false);
  constructor() {}
  sideBarToggle(condition: boolean) {
    if (condition) {
      setTimeout(() => {
        console.log('timer');

        this.isOpened.next(condition);
      }, 200);
    } else {
      this.isOpened.next(condition);
    }
  }
  keepOpenToggle(condition: boolean) {
    this.keepOpen.next(condition);
  }
}
