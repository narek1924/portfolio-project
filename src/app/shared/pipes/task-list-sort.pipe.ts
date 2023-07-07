import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import * as moment from 'moment';

@Pipe({
  name: 'taskListSort',
})
export class TaskListSortPipe implements PipeTransform {
  transform(value: Task[], filterParam: string): Task[] {
    if (!value) {
      return value;
    }
    const sortedArray = [...value].sort((a, b) => +a.done - +b.done);

    if (filterParam === 'Today') {
      return sortedArray.filter(
        (task) =>
          moment(task.creationTime).calendar().split(' ')[0] === filterParam ||
          +task.creationTime < +new Date()
      );
    } else if (filterParam === 'Tomorrow') {
      return sortedArray.filter(
        (task) =>
          moment(task.creationTime).calendar().split(' ')[0] === filterParam
      );
    } else {
      return sortedArray.filter((task) => {
        let info = moment(task.creationTime).calendar().split(' ')[0];
        return (
          info !== 'Today' &&
          info !== 'Tomorrow' &&
          +task.creationTime > +new Date()
        );
      });
    }
  }
}
