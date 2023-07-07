import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, take, tap } from 'rxjs';

import { Task } from 'src/app/shared/interfaces/task.interface';
import { AppState } from '../../shared/app-state/reducers';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { animate, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-my-day-suggestions',
  templateUrl: './my-day-suggestions.component.html',
  styleUrls: ['./my-day-suggestions.component.scss'],
  animations: [
    trigger('item', [
      transition(':enter', [
        style({ height: 0, paddingTop: 0, paddingBottom: 0 }),
        animate(
          150,
          style({
            height: '*',
            paddingTop: '*',
            paddingBottom: '*',
          })
        ),
      ]),
    ]),
  ],
})
export class MyDaySuggestionsComponent implements OnInit {
  $myDayTasks?: Observable<Task[]>;
  filterParam = '';
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.$myDayTasks = this.store
      .select('appState')
      .pipe(map((data) => data.tasks?.filter((task) => !task.myDay)));
  }
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
