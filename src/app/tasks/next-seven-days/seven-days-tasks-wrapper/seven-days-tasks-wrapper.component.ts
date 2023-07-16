import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskEditService } from '../../task-edit/task-list.service';
import { MatDialog } from '@angular/material/dialog';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';
import { SideBarService } from 'src/app/side-bar/side-bar.service';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import { TaskEditComponent } from '../../task-edit/task-edit.component';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seven-days-tasks-wrapper',
  templateUrl: './seven-days-tasks-wrapper.component.html',
  styleUrls: ['./seven-days-tasks-wrapper.component.scss'],
})
export class SevenDaysTasksWrapperComponent implements OnInit {
  multiSelect = false;
  selectedTasks: Date[] = [];
  subscription = new Subscription();
  @Input() tasks!: Task[];
  @Output() dragAndDrop = new EventEmitter<any>();
  constructor(
    private taskEditService: TaskEditService,
    private matDialog: MatDialog,
    private tasksService: TasksStateService,
    private sidebarService: SideBarService
  ) {}
  ngOnInit(): void {
    this.taskEditService.multiSelect.subscribe((condition) => {
      this.multiSelect = condition;
    });
    this.subscription.add(
      this.taskEditService.taskChanged.subscribe((array) => {
        this.selectedTasks = array;
      })
    );
    this.subscription.add(
      this.taskEditService.clearDoneTasks.subscribe((action) => {
        let array: Date[] = [];
        this.tasks.map((task) => task.done && array.push(task.creationTime));
        this.tasksService.deleteTask(array);
        this.deleteTask(array);
      })
    );
  }
  onEdit(task: Task) {
    if (this.multiSelect) {
      if (!task.done) {
        this.taskEditService.selectTask(task.creationTime);
      }
      return;
    }
    this.taskEditService.task.next(task);
    let dialogRef = this.matDialog.open(TaskEditComponent, {
      panelClass: 'task-edit-modal',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.type === 'delete') {
          this.deleteTask(result.task.creationTime);
          return;
        }
        this.tasks.map((v, i) => {
          if (result.task.creationTime === v.creationTime) {
            let array = [...this.tasks];
            array[i] = { ...result.task };
            this.tasks = [...array];
          }
        });
      }
    });
  }
  onCheckboxChange(task: Task, event: Event) {
    if (this.multiSelect) {
      return;
    }
    let oldIndex = this.tasks.findIndex(
      (item) => task.creationTime === item.creationTime
    );

    this.tasks[oldIndex] = {
      ...this.tasks[oldIndex],
      done: (event.target as HTMLInputElement).checked,
    };

    this.tasks = this.tasks.slice();
    this.tasksService.changeDoneStatus({
      condition: (event.target as HTMLInputElement).checked,
      date: this.tasks[oldIndex].creationTime,
    });
  }
  deleteTask(date: Date | Date[]) {
    if (Array.isArray(date)) {
      this.tasks.map(() => {
        this.tasks = this.tasks.filter(
          (task) => !date.includes(task.creationTime)
        );
      });
      return;
    }
    this.tasksService.deleteTask(date);
    this.tasks.map((v) => {
      if (v.creationTime === date) {
        this.tasks = this.tasks.filter((task) => task.creationTime !== date);
      }
    });
  }
  drop(event: CdkDragDrop<Task[]>) {
    this.dragAndDrop.emit(event);
  }
  onDragStarted() {
    this.sidebarService.drag.next(true);
  }
}
