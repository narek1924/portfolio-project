import { Action, ActionReducerMap } from '@ngrx/store';

import { Task, priorityStatus } from '../interfaces/task.interface';
import * as appStateActions from './app-state-actions';
import * as moment from 'moment';

export interface State {
  name: string;
  tasks: Task[];
  lists: string[];
  priorityStatuses: priorityStatus[];
}

const initialState: State = {
  name: null as any,
  tasks: [],
  lists: [],
  priorityStatuses: [
    { status: 'Critical', color: '#6C0BA9' },
    { status: 'High', color: '#F44336 ' },
    { status: 'Urgent', color: '#E65100' },
    { status: 'Low', color: '#4CAF50' },
    { status: 'Optional', color: '#808080' },
  ],
};

export function appStateReducer(
  state: State = initialState,
  action: appStateActions.union
): State {
  switch (action.type) {
    case appStateActions.ADD_TASK:
      let data = action.payload;
      let task = new Task(
        data.name,
        data.creationTime ? data.creationTime : new Date(),
        data.list ? data.list : state.lists[0],
        data.myDay,
        data.done,
        data.priority ?? data.priority,
        data.notes ?? data.notes,
        data.subtasks ?? data.subtasks
      );

      return {
        ...state,
        tasks: [task, ...state.tasks],
      };
    case appStateActions.FETCH_TASKS: {
      let data = action.payload;
      let array: Task[] = [];
      data.map((task) => {
        let item = new Task(
          task.name,
          new Date(task.creationTime),
          task.list,
          task.myDay,
          task.done,
          task.priority ?? task.priority,
          task.notes ?? task.notes,
          task.subTasks ?? task.subTasks
        );
        array.push(item);
      });

      return { ...state, tasks: array };
    }
    case appStateActions.ADD_NAME: {
      return {
        ...state,
        name: action.payload,
      };
    }
    case appStateActions.DELETE_TASK: {
      let array: Task[] = [];
      if (Array.isArray(action.payload)) {
        array = [...state.tasks].filter(
          (task) => !(action.payload as Date[]).includes(task.creationTime)
        );
      } else {
        array = [...state.tasks].filter(
          (task) =>
            task.creationTime.getTime() !== (action.payload as Date).getTime()
        );
      }
      return {
        ...state,
        tasks: array,
      };
    }
    case appStateActions.CHANGE_STATUS: {
      let array: Task[] = [...state.tasks];
      array.map((v, i, a) => {
        if (v.creationTime.getTime() === action.payload.date.getTime()) {
          a[i] = { ...a[i], myDay: action.payload.condition };
        }
      });
      return {
        ...state,
        tasks: array,
      };
    }
    case appStateActions.CHANGE_DATE: {
      let array: Task[] = [...state.tasks];
      array.map((v, i, a) => {
        if (v.creationTime.getTime() === action.payload.date.getTime()) {
          if (
            action.payload.date.getTime() - new Date().getTime() < 0 &&
            moment(action.payload.date).calendar().split(' ')[0] !== 'Today'
          ) {
            a[i] = {
              ...a[i],
              creationTime: action.payload.modifiedDate,
              overDue: false,
            };
            return;
          }
          a[i] = {
            ...a[i],
            creationTime: action.payload.modifiedDate,
          };
        }
      });
      return {
        ...state,
        tasks: array,
      };
    }
    case appStateActions.CHANGE_DONE_STATUS: {
      let array = [...state.tasks];
      if (Array.isArray(action.payload.date)) {
        array.map((v, i, a) => {
          if ((action.payload.date as Date[]).includes(v.creationTime)) {
            a[i] = { ...a[i], done: action.payload.condition };
          }
        });
      } else {
        array.map((v, i, a) => {
          if (
            v.creationTime.getTime() === (action.payload.date as Date).getTime()
          ) {
            a[i] = { ...a[i], done: action.payload.condition };
          }
        });
      }
      return {
        ...state,
        tasks: array,
      };
    }
    case appStateActions.MODIFY_TASK: {
      let array: Task[] = [...state.tasks];
      array.map((v, i, a) => {
        if (
          v.creationTime.getTime() === action.payload.creationTime.getTime()
        ) {
          a[i] = { ...action.payload };
        }
      });
      return {
        ...state,
        tasks: array,
      };
    }
    case appStateActions.CHANGE_LIST: {
      let array: Task[] = [...state.tasks];
      array.map((v, i, a) => {
        if (action.payload.date.includes(v.creationTime)) {
          a[i] = { ...a[i], list: action.payload.list };
        }
      });
      return {
        ...state,
        tasks: array,
      };
    }
    case appStateActions.CHANGE_PRIORITY_STATUS: {
      let array: Task[] = [...state.tasks];
      array.map((v, i, a) => {
        if (action.payload.date.includes(v.creationTime)) {
          a[i] = { ...a[i], priority: action.payload.priorityStatus };
        }
      });
      return {
        ...state,
        tasks: array,
      };
    }
    case appStateActions.ADD_LIST: {
      let array = [...state.lists];
      array.push(action.payload);
      return {
        ...state,
        lists: array,
      };
    }
    case appStateActions.DELETE_LIST: {
      let array = [...state.lists];
      let tasksArray = [...state.tasks];

      array.map((v, i, a) => {
        if (v === action.payload) {
          a.splice(i, 1);
        }
      });
      tasksArray.map((v, i, a) => {
        if (v.list === action.payload) {
          a.splice(i, 1);
        }
      });

      return {
        ...state,
        lists: array,
        tasks: tasksArray,
      };
    }
    case appStateActions.FETCH_LISTS: {
      return {
        ...state,
        lists: action.payload,
      };
    }
    case appStateActions.RESET_TASKS: {
      return {
        ...state,
        tasks: [],
      };
    }
    default:
      return {
        ...state,
      };
  }
}
