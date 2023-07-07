import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: Task[]): Task[] {
    return value.sort((a, b) => {
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
  }
}
