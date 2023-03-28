import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Task } from 'src/app/shared/angular-material/task.interface';

@Component({
  selector: 'app-my-day-content',
  animations: [
    trigger('decorationAnimation', [
      state(
        'emptyWrapper',
        style({
          opacity: '1',
        })
      ),
      state(
        'nonEmptyWrapper',
        style({
          opacity: '0',
          display: 'none',
        })
      ),
      transition('emptyWrapper => nonEmptyWrapper', [
        animate(
          '400ms',
          keyframes([
            style({ opacity: 1, offset: 0 }),
            style({ opacity: 0.75, offset: 0.25 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 0.25, offset: 0.75 }),
            style({ opacity: 0, offset: '1' }),
          ])
        ),
      ]),
      transition('nonEmptyWrapper => emptyWrapper', [
        animate(
          '400ms',
          keyframes([
            style({ opacity: 0, display: 'block', offset: 0 }),
            style({ opacity: 0.25, offset: 0.25 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 0.755, offset: 0.75 }),
            style({ opacity: 1, offset: '1' }),
          ])
        ),
      ]),
    ]),
    trigger('item', [
      transition(
        ':leave',
        animate(
          150,
          style({
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginBottom: 0,
          })
        )
      ),
      transition(':enter', [
        style({ height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }),
        animate(
          150,
          style({
            height: '*',
            paddingTop: '*',
            paddingBottom: '*',
            marginBottom: '*',
          })
        ),
      ]),
    ]),
  ],
  templateUrl: './my-day-content.component.html',
  styleUrls: ['./my-day-content.component.scss'],
})
export class MyDayContentComponent implements OnInit {
  myDayTasks: Task[] = [];
  date = new Date();
  dayOfWeekString = this.date.toLocaleString('en-US', { weekday: 'short' });
  dayOfMonth = this.date.getDate();
  greetingTime?: string;
  month = this.date.toLocaleString('en-US', { month: 'long' });
  constructor(private _formBuilder: FormBuilder) {}

  taskName = this._formBuilder.group({
    taskNameForm: [''],
  });

  ngOnInit(): void {
    let time = this.date.getHours();
    if (time < 12 && time > 4) {
      this.greetingTime = 'Morning';
    } else if (time > 12 && time < 18) {
      this.greetingTime = 'Afternoon';
    } else if (time > 18 || time < 4) {
      this.greetingTime = 'Evening';
    }
  }
  createTask(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.taskName.value.taskNameForm) {
      this.myDayTasks.unshift(
        new Task(this.taskName.value.taskNameForm, new Date(), 'personal', true)
      );
      if (!this.myDayTasks.length) {
      }
      this.taskName.reset();
    }
  }
  delete(index: number) {
    this.myDayTasks.splice(index, 1);
  }
}
