import { Action } from '@ngrx/store';
import { Task, priorityStatus, subTask } from '../interfaces/task.interface';

export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const CHANGE_STATUS = 'CHANGE_STATUS';
export const CHANGE_DATE = 'CHANGE_DATE';
export const CHANGE_DONE_STATUS = 'CHANGE_DONE_STATUS';
export const MODIFY_TASK = 'MODIFY_TASK';
export const CHANGE_PRIORITY_STATUS = 'CHANGE_PRIORITY_STATUS';
export const CHANGE_LIST = 'CHANGE_LIST';
export const ADD_NAME = 'ADD_NAME';
export const FETCH_TASKS = 'FETCH_TASKS';
export const ADD_LIST = 'ADD_LIST';
export const DELETE_LIST = 'DELETE_LIST';
export const FETCH_LISTS = 'FETCH_LISTS';
export const RESET_TASKS = 'RESET_TASKS';

export class addTask implements Action {
  readonly type = ADD_TASK;
  constructor(
    public payload: {
      name: string;
      creationTime?: Date;
      list?: string;
      myDay: boolean;
      done: boolean;
      priority?: priorityStatus;
      subtasks?: subTask[];
      notes?: string;
    }
  ) {}
}
export class fetchTasks implements Action {
  readonly type = FETCH_TASKS;
  constructor(public payload: Task[]) {}
}
export class deleteTask implements Action {
  readonly type = DELETE_TASK;
  constructor(public payload: Date | Date[]) {}
}
export class changeStatus implements Action {
  readonly type = CHANGE_STATUS;
  constructor(public payload: { condition: boolean; date: Date }) {}
}
export class changeDate implements Action {
  readonly type = CHANGE_DATE;
  constructor(
    public payload: { days: number; date: Date; modifiedDate: Date }
  ) {}
}
export class changeDoneStatus implements Action {
  readonly type = CHANGE_DONE_STATUS;
  constructor(public payload: { condition: boolean; date: Date | Date[] }) {}
}
export class changePriorityStatus implements Action {
  readonly type = CHANGE_PRIORITY_STATUS;
  constructor(
    public payload: { priorityStatus: priorityStatus; date: Date[] }
  ) {}
}
export class changeList implements Action {
  readonly type = CHANGE_LIST;
  constructor(public payload: { list: string; date: Date[] }) {}
}
export class modifyTask implements Action {
  readonly type = MODIFY_TASK;
  constructor(public payload: Task) {}
}
export class addName implements Action {
  readonly type = ADD_NAME;
  constructor(public payload: string) {}
}
export class addList implements Action {
  readonly type = ADD_LIST;
  constructor(public payload: string) {}
}
export class deleteList implements Action {
  readonly type = DELETE_LIST;
  constructor(public payload: string) {}
}
export class fetchLists implements Action {
  readonly type = FETCH_LISTS;
  constructor(public payload: string[]) {}
}
export class resetTasks implements Action {
  readonly type = RESET_TASKS;
}

export type union =
  | addTask
  | fetchTasks
  | deleteTask
  | changeStatus
  | changeDate
  | changeDoneStatus
  | modifyTask
  | changeList
  | changePriorityStatus
  | addName
  | addList
  | fetchLists
  | deleteList
  | resetTasks;
