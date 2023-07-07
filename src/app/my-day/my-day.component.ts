import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SideBarService } from '../side-bar/side-bar.service';
import { AppState } from '../shared/app-state/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-my-day',
  templateUrl: './my-day.component.html',
  styleUrls: ['./my-day.component.scss'],
})
export class MyDayComponent implements OnInit, OnDestroy {
  userName!: string;
  date = new Date();
  dayOfWeekString = this.date.toLocaleString('en-US', { weekday: 'short' });
  dayOfMonth = this.date.getDate();
  greetingTime?: string;
  month = this.date.toLocaleString('en-US', { month: 'long' });
  greetingQuotes = [
    'Be so good no one can ignore you',
    'What will you accomplish today?',
    'This is your private space',
    'Remove doubts with action',
    'You are what you do',
    'You can make magic happen',
    'Let’s make an impact',
    'What’s your plan for today',
  ];
  randomQuote!: string;
  isOpened?: boolean;
  subscription = new Subscription();

  constructor(
    private sbService: SideBarService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    const randomIndex = Math.floor(Math.random() * this.greetingQuotes.length);
    this.randomQuote = this.greetingQuotes[randomIndex];
    this.subscription.add(
      this.sbService.isOpened.subscribe(
        (condition) => (this.isOpened = condition)
      )
    );
    this.subscription.add(
      this.store.select('appState').subscribe((data) => {
        this.userName = data.name;
      })
    );

    let time = this.date.getHours();
    if (time <= 12 && time >= 4) {
      this.greetingTime = 'Morning';
    } else if (time > 12 && time <= 18) {
      this.greetingTime = 'Afternoon';
    } else if (time > 18 || time < 4) {
      this.greetingTime = 'Evening';
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
