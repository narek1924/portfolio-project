import { Injectable } from '@angular/core';
import { Task, priorityStatus } from '../interfaces/task.interface';

import { AppState } from './reducers';
import * as fromappStateActions from './app-state-actions';
import { Store } from '@ngrx/store';
import { DataStorageService } from '../data-storage-service/data-storage.service';
import { AuthService } from 'src/app/auth/auth/auth.service';
interface User {
  name: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksStateService {
  userId!: string;
  constructor(
    private store: Store<AppState>,
    private dataService: DataStorageService,
    private authService: AuthService
  ) {
    this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
  }
  resetTasks() {
    this.store.dispatch(new fromappStateActions.resetTasks());
  }
  addTask(taskinfo: {
    name: string;
    creationTime?: Date;
    list?: string;
    myDay: boolean;
    done: boolean;
    priority?: priorityStatus;
  }) {
    this.store.dispatch(new fromappStateActions.addTask(taskinfo));
    this.dataService.changeData(this.userId, 'tasks');
  }
  deleteTask(time: Date | Date[]) {
    this.store.dispatch(new fromappStateActions.deleteTask(time));
    this.dataService.changeData(this.userId, 'tasks');
  }
  changeStatus(taskInfo: { condition: boolean; date: Date }) {
    this.store.dispatch(new fromappStateActions.changeStatus(taskInfo));
    this.dataService.changeData(this.userId, 'tasks');
  }
  changeDate(taskInfo: { days: number; date: Date; modifiedDate: Date }) {
    this.store.dispatch(new fromappStateActions.changeDate(taskInfo));
    this.dataService.changeData(this.userId, 'tasks');
  }
  changeDoneStatus(taskInfo: { condition: boolean; date: Date | Date[] }) {
    this.store.dispatch(new fromappStateActions.changeDoneStatus(taskInfo));
    this.dataService.changeData(this.userId, 'tasks');
  }
  modifyTask(task: Task) {
    this.store.dispatch(new fromappStateActions.modifyTask(task));
    this.dataService.changeData(this.userId, 'tasks');
  }
  changeList(taskInfo: { date: Date[]; list: string }) {
    this.store.dispatch(new fromappStateActions.changeList(taskInfo));
    this.dataService.changeData(this.userId, 'tasks');
  }
  changePriorityStatus(taskInfo: {
    date: Date[];
    priorityStatus: priorityStatus;
  }) {
    this.store.dispatch(new fromappStateActions.changePriorityStatus(taskInfo));
    this.dataService.changeData(this.userId, 'tasks');
  }
  addList(title: string) {
    this.store.dispatch(new fromappStateActions.addList(title));
    this.dataService.changeData(this.userId, 'lists');
  }
  deleteList(title: string) {
    this.store.dispatch(new fromappStateActions.deleteList(title));
    this.dataService.changeData(this.userId, 'lists');
    this.dataService.changeData(this.userId, 'tasks');
  }
  changeName(name: string) {
    this.store.dispatch(new fromappStateActions.addName(name));
    this.dataService.changeUsername(this.userId, name);
  }
}
