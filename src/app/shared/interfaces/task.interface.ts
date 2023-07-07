import * as moment from 'moment';

export interface subTask {
  done: boolean;
  name: string;
}
export interface priorityStatus {
  status: string;
  color: string;
}
export class Task {
  constructor(
    public name: string,
    public creationTime: Date,
    public list: string,
    public myDay: boolean,
    public done: boolean,
    public priority?: priorityStatus,
    public notes?: string,
    public subTasks?: subTask[],
    public dayInfo?: string,
    public overDue?: boolean
  ) {
    let compareTime = moment(this.creationTime).calendar().split(' ')[0];

    switch (compareTime) {
      case 'Yesterday': {
        this.dayInfo = 'From yesterday';
        break;
      }
      case 'Today': {
        this.dayInfo = 'Due today';
        break;
      }
      case 'Tomorrow': {
        this.dayInfo = 'Due tomorrow';
        break;
      }
      default: {
        if (Number(new Date()) - Number(this.creationTime) > 0) {
          this.dayInfo = 'Overdue';
        } else {
          this.dayInfo = 'Coming soon';
        }
      }
    }
  }
}
