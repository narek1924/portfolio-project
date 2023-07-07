import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Pipe({
  name: 'filterByList',
})
export class FilterByListPipe implements PipeTransform {
  transform(tasks: Task[], listValue: string | null): any[] {
    if (!tasks || !listValue) {
      return tasks;
    }
    return [...tasks].filter((task) => task.list === listValue);
  }
}
