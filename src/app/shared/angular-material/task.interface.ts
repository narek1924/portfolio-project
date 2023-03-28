export class Task {
  constructor(
    public name: string,
    public time: Date,
    public list: string,
    public myDay: boolean,
    public notes?: string,
    public subTask?: string
  ) {}
}
