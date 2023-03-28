import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SideBarService } from '../side-bar/side-bar.service';

@Component({
  selector: 'app-my-day',
  templateUrl: './my-day.component.html',
  styleUrls: ['./my-day.component.scss'],
})
export class MyDayComponent implements OnInit, OnDestroy {
  isOpened?: boolean;
  subscription = new Subscription();

  constructor(private SbService: SideBarService) {}

  ngOnInit(): void {
    this.subscription = this.SbService.isOpened.subscribe(
      (condition) => (this.isOpened = condition)
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
