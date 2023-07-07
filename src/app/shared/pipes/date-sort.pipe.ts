import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Pipe({
  name: 'dateSort',
})
export class DateSortPipe implements PipeTransform {
  transform(value: Task[]): Task[] {
    if (!value) {
      return value;
    }
    value.sort((a, b) => {
      if (+a.creationTime > +b.creationTime) {
        return 1;
      } else if (+a.creationTime < +b.creationTime) {
        {
          return -1;
        }
      } else {
        return 0;
      }
    });
    return value;
  }
}
