import { Task, priorityStatus } from 'src/app/shared/interfaces/task.interface';

// export interface TasksWithDate {
//   day: string;
//   tasks: Task[];
//   show: Boolean;
// }
export interface TasksWithDate {
  day: string;
  show: Boolean;
}
interface button {
  iconSrc: string;
  value: any;
  pickValue: any;
}
export interface taskPropertyButtons {
  menuOpen: number;
  datePicker: { title: string; date: Date };
  buttons: button[];
}
