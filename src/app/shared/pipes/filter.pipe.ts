import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: Task[], filterParam: string): Task[] {
    if (!value) {
      return value;
    }
    return value.filter((task) =>
      task.name.toLowerCase().includes(filterParam.toLowerCase())
    );
  }
}
