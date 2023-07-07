import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';
import { Task, priorityStatus } from 'src/app/shared/interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskEditService {
  taskDateArray: Date[] = [];
  taskChanged = new Subject<Date[]>();
  taskArrayLength = new BehaviorSubject(0);
  multiSelect = new BehaviorSubject(false);
  clearDoneTasks = new Subject();
  clearCompletedButton = new BehaviorSubject(false);
  pageTitle = new BehaviorSubject(null as any);
  filterParam = new BehaviorSubject<string | null>(null);
  taskToEdit = new BehaviorSubject<boolean>(null as any);
  listMenu = new BehaviorSubject(false);
  task = new BehaviorSubject(null as any);
  deleteTasks = new Subject();
  deleteTask = new Subject<Task>();
  changeTaskProperty = new Subject();
  constructor(private tasksService: TasksStateService) {}
  selectTask(date: Date) {
    if (this.taskDateArray.includes(date)) {
      this.taskDateArray = this.taskDateArray.filter(
        (selectedItemDate) => selectedItemDate !== date
      );
      this.taskArrayLength.next(this.taskDateArray.length);
      this.taskChanged.next(this.taskDateArray.slice());
      return;
    }
    this.taskDateArray.push(date);
    this.taskArrayLength.next(this.taskDateArray.length);
    this.taskChanged.next(this.taskDateArray.slice());
  }
  resetTaskArray() {
    this.taskDateArray = [];
    this.taskChanged.next([]);
    this.taskArrayLength.next(0);
  }
  deleteSelectedTasks() {
    this.multiSelect.next(false);
    this.tasksService.deleteTask(this.taskDateArray);
    this.deleteTasks.next(true);
    this.taskArrayLength.next(0);
    this.resetTaskArray();
  }
  markAsDone() {
    this.multiSelect.next(false);
    this.tasksService.changeDoneStatus({
      condition: true,
      date: this.taskDateArray,
    });
    this.changeTaskProperty.next({ property: 'done', value: true });
    this.resetTaskArray();
    this.taskArrayLength.next(0);
  }
  changeList(list: string) {
    this.tasksService.changeList({ date: this.taskDateArray, list: list });
    this.changeTaskProperty.next({ property: 'list', value: list });
  }
  changePriorityStatus(priorityStatus: priorityStatus) {
    this.tasksService.changePriorityStatus({
      date: this.taskDateArray,
      priorityStatus: priorityStatus,
    });
    this.changeTaskProperty.next({
      property: 'priority',
      value: priorityStatus,
    });
  }
}
