import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import { Task } from './interfaces/task.interface';
import { TasksWithDate } from '../tasks/tasks-list/interfaces';

function sevenDaysTaskNames(days: number) {
  if (days === 0) {
    return ['Today', new Date().toLocaleString('en-US', { weekday: 'long' })];
  } else if (days === 1) {
    return [
      'Tomorrow',
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleString(
        'en-US',
        {
          weekday: 'long',
        }
      ),
    ];
  } else {
    return [moment().clone().add(days, 'days').calendar().split(' ')[0]];
  }
}
export function sevenDaysSort(
  tasksArray: Task[],
  sortedArray: { day: string[]; tasks: Task[] }[],
  index: number
) {
  sortedArray[index] = {
    day: sevenDaysTaskNames(index),
    tasks: [],
  };
  if (index === 0) {
    for (let task of tasksArray) {
      if (
        moment(task.creationTime).calendar().split(' ')[0] === 'Today' ||
        +task.creationTime < +new Date()
      ) {
        if (
          +task.creationTime < +new Date() &&
          moment(task.creationTime).calendar().split(' ')[0] !== 'Today'
        ) {
          let item = { ...task };
          item.overDue = true;
          task = { ...item };
        }
        sortedArray[index].tasks.push(task);
      }
    }
  } else {
    let arr = tasksArray.filter(
      (task: Task) =>
        moment(task.creationTime).calendar().split(' ')[0] ===
        sortedArray[index].day[0]
    );
    sortedArray[index].tasks = arr;
  }
}
export function taskAutoSelect(
  array: Task[],
  service: any,
  filterParam: string | null
) {
  let modifiedArray = [...array].sort((a, b) => {
    if (a.done > b.done) {
      return 1;
    } else if (a.done < b.done) {
      {
        return -1;
      }
    } else {
      return 0;
    }
  });
  let clearButton = false;
  let filteredArray = modifiedArray.filter((task) =>
    filterParam ? task.list === filterParam : true
  );
  let todayTasks = filteredArray.filter(
    (task) =>
      task.dayInfo === 'Due today' ||
      task.dayInfo === 'Overdue' ||
      task.dayInfo === 'From yesterday'
  );
  let tomorrowTasks = filteredArray.filter(
    (task) => task.dayInfo === 'Due tomorrow'
  );
  let upcomingTasks = filteredArray.filter(
    (task) => task.dayInfo === 'Coming soon'
  );
  if (todayTasks.length) {
    service.task.next(todayTasks[0]);
  } else if (tomorrowTasks.length) {
    service.task.next(tomorrowTasks[0]);
  } else if (upcomingTasks.length) {
    service.task.next(upcomingTasks[0]);
  }

  filteredArray.map((task) => task.done && (clearButton = true));
  service.clearCompletedButton.next(clearButton);
}
export function drop(event: CdkDragDrop<Task[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
