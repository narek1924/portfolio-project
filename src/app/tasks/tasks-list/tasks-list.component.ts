import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import {
  arrowAnimation,
  firstElementAnimation,
  itemAnimation,
  opacityAnimation,
  quickAddButtons,
  secondElementAnimation,
} from 'src/app/shared/animations';
import { AppState } from 'src/app/shared/app-state/reducers';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';
import { taskPropertyButtons } from './interfaces';
import { TaskEditService } from '../task-edit/task-list.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  animations: [
    firstElementAnimation,
    secondElementAnimation,
    arrowAnimation,
    quickAddButtons,
    itemAnimation,
    opacityAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent implements OnInit, OnDestroy {
  taskPropertyButtons: taskPropertyButtons = {
    datePicker: { title: '', date: null as any },
    menuOpen: -1,
    buttons: [
      { iconSrc: '/assets/svg-icons/list-icon.svg', value: '', pickValue: [] },
      {
        iconSrc: '/assets/svg-icons/hashtag-icon.svg',
        value: '',
        pickValue: [],
      },
    ],
  };
  information: boolean = false;
  minDate = new Date();
  taskTitle!: string;
  animation = false;
  isFocused = false;
  subscription = new Subscription();
  filterParam!: string | null;
  constructor(
    private store: Store<AppState>,
    private tasksService: TasksStateService,
    private cdRef: ChangeDetectorRef,
    private taskEditService: TaskEditService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.select('appState').subscribe((data) => {
        this.taskPropertyButtons.buttons[0].pickValue = [...data.lists];
        this.taskPropertyButtons.buttons[1].pickValue = [
          ...data.priorityStatuses,
        ];
        this.cdRef.detectChanges();
      })
    );
    this.subscription.add(
      this.taskEditService.taskToEdit.subscribe((condition) => {
        this.information = condition;
        setTimeout(() => {
          this.cdRef.detectChanges();
        }, 0);
      })
    );
    this.subscription.add(
      this.taskEditService.filterParam.subscribe((param) => {
        this.filterParam = param;
      })
    );
  }
  createTask(input: HTMLInputElement) {
    if (this.taskTitle && this.taskTitle.trim()) {
      let date = this.taskPropertyButtons.datePicker.date;
      let list = this.taskPropertyButtons.buttons[0].value;
      let priority = this.taskPropertyButtons.buttons[1].value;
      this.tasksService.addTask({
        name: this.taskTitle.trim(),
        creationTime: date ? date : (null as any),
        list: list ? list : this.filterParam,
        myDay: false,
        done: false,
        priority: priority ? priority : '',
      });
      this.taskTitle = '';
      (this.taskPropertyButtons.buttons[0].value = ''),
        (this.taskPropertyButtons.buttons[1].value = ''),
        (this.taskPropertyButtons.datePicker.title = '');
      this.taskPropertyButtons.datePicker.date = null as any;
      this.animation = true;
      this.cdRef.detectChanges();

      setTimeout(() => {
        this.animation = false;
        this.cdRef.detectChanges();
      }, 150);
    }
    input.focus();
  }
  focus(event: FocusEvent) {
    let isEmpty = true;
    for (let button of this.taskPropertyButtons.buttons) {
      if (button.value) {
        isEmpty = false;
      }
    }
    if (event.type === 'focus') {
      this.isFocused = true;
      return;
    }
    if ((this.taskTitle && this.taskTitle.trim()) || !isEmpty) {
      return;
    }
    if (event.relatedTarget) {
      return;
    }
    this.isFocused = false;
    this.taskPropertyButtons.menuOpen = -1;
  }
  selectTaskProperties(index: number, value: string, input: HTMLInputElement) {
    if (this.taskPropertyButtons.menuOpen === index) {
      this.taskPropertyButtons.menuOpen = -1;
      input.focus();
      return;
    }
    if (value) {
      this.taskPropertyButtons.buttons[index].value = '';
      input.focus();
      return;
    }
    this.taskPropertyButtons.menuOpen = index;
  }
  changeButtonValue(value: any, input: HTMLInputElement) {
    this.taskPropertyButtons.buttons[this.taskPropertyButtons.menuOpen].value =
      value;
    this.taskPropertyButtons.menuOpen = -1;
    input.focus();
  }
  dateHandler(event: MatDatepickerInputEvent<Date>, input: HTMLInputElement) {
    this.taskPropertyButtons.datePicker.title = moment(event.value)
      .calendar()
      .split(' ')[0];
    if (event.value) {
      this.taskPropertyButtons.datePicker.date = event.value;
    }
    input.focus();
  }
  datePickerButton(picker: MatDatepicker<any>, input: HTMLInputElement) {
    if (this.taskPropertyButtons.datePicker.title) {
      this.taskPropertyButtons.datePicker.title = '';
      this.taskPropertyButtons.datePicker.date = null as any;
      input.focus();
      return;
    }
    picker.open();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
