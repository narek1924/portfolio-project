import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription, take, tap } from 'rxjs';

import { Task } from 'src/app/shared/interfaces/task.interface';
import { AppState } from '../../shared/app-state/reducers';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';
import { itemAnimation, decorationAnimation } from 'src/app/shared/animations';
import { drop } from 'src/app/shared/functions';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditService } from 'src/app/tasks/task-edit/task-list.service';
import { TaskEditComponent } from 'src/app/tasks/task-edit/task-edit.component';

@Component({
  selector: 'app-my-day-content',
  templateUrl: './my-day-content.component.html',
  styleUrls: ['./my-day-content.component.scss'],
  animations: [itemAnimation, decorationAnimation],
})
export class MyDayContentComponent implements OnInit, AfterViewInit {
  animationDisabled: boolean = true;
  // $myDayTasks!: Observable<Task[]>;
  myDayTasks!: Task[];
  taskName = this._formBuilder.group({
    taskNameForm: [''],
  });
  lists!: string[];
  subscription!: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<AppState>,
    private taskService: TasksStateService,
    private matDialog: MatDialog,
    private taskEditService: TaskEditService
  ) {}
  ngOnInit(): void {
    this.subscription = this.store
      .select('appState')
      .pipe(
        map((data) => {
          this.lists = [...data.lists];
          this.myDayTasks = data.tasks?.filter((task) => task.myDay);
        })
      )
      .subscribe(() => {
        setTimeout(() => {
          if (this.animationDisabled) {
            this.animationDisabled = false;
          }
        }, 0);
      });
  }
  ngAfterViewInit(): void {
    this.animationDisabled = false;
  }
  createTask() {
    if (
      this.taskName.value.taskNameForm &&
      this.taskName.value.taskNameForm.trim()
    ) {
      let task = new Task(
        this.taskName.value.taskNameForm,
        new Date(),
        this.lists[0],
        true,
        false
      );
      this.taskService.addTask(task);
      this.taskName.reset();
    }
  }
  onEdit(task: Task) {
    this.taskEditService.task.next(task);
    this.matDialog.open(TaskEditComponent, {
      panelClass: 'task-edit-modal',
    });
  }
  onCheckboxChange(task: Task, event: Event, index: number) {
    this.animationDisabled = true;
    setTimeout(() => {
      this.taskService.changeDoneStatus({
        condition: (event.target as HTMLInputElement).checked,
        date: task.creationTime,
      });
    }, 0);
  }
  removeFromMyDay(date: Date) {
    this.taskService.changeStatus({ condition: false, date: date });
  }
  drop(event: CdkDragDrop<Task[]>) {
    drop(event);
    if (
      event.previousContainer.element.nativeElement.className.split(' ')[1] !==
      'content-box'
    ) {
      this.taskService.changeStatus({
        condition: true,
        date: event.container.data[event.currentIndex].creationTime,
      });
    }
  }
}
