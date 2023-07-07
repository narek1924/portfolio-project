import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import {
  Task,
  priorityStatus,
  subTask,
} from 'src/app/shared/interfaces/task.interface';
import { TaskEditService } from './task-list.service';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { AppState } from 'src/app/shared/app-state/reducers';
import { Store } from '@ngrx/store';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
})
export class TaskEditComponent implements OnInit, OnDestroy {
  task!: Task;
  nameInput!: string;
  subTaskNames: string[] = [];
  notesInput!: string;
  subscription = new Subscription();
  lists!: string[];
  priorities!: priorityStatus[];
  @ViewChildren('subtaskNameInput') subtaskInputs!: QueryList<ElementRef>;
  constructor(
    private taskEditService: TaskEditService,
    private matDialog: MatDialog,
    private store: Store<AppState>,
    private tasksService: TasksStateService,
    @Optional()
    @Inject(MatDialogRef<TaskEditComponent>)
    private matDialogRef: any,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.subscription.add(
      this.taskEditService.task.subscribe((task) => {
        this.task = { ...task };

        this.nameInput = this.task.name;
        if (this.task.notes) {
          this.notesInput = this.task.notes;
        } else {
          this.notesInput = '';
        }
        if (this.task.subTasks) {
          this.subTaskNames = [
            ...this.task.subTasks.map((subtask) => subtask.name),
          ];
        }
      })
    );

    this.subscription.add(
      this.store.select('appState').subscribe((data) => {
        this.lists = [...data.lists];
        this.priorities = [...data.priorityStatuses];
      })
    );
  }

  addSubtask() {
    if (
      this.task.subTasks &&
      this.task.subTasks.length &&
      [...this.task.subTasks].pop()!.name
    ) {
      console.log(this.task.subTasks);

      this.task.subTasks = [...this.task.subTasks, { done: false, name: '' }];
    } else {
      this.task.subTasks = [{ done: false, name: '' }];
    }

    setTimeout(() => {
      if (this.subtaskInputs.last) {
        this.subtaskInputs.last.nativeElement.focus();
      }
    });
  }
  subtaskBlur(index: number, subtask: subTask, event: FocusEvent) {
    if (subtask.name && !this.subTaskNames[index]) {
      this.subTaskNames[index] = subtask.name;
      return;
    }
    if (this.subTaskNames[index]) {
      subtask.name = this.subTaskNames[index];
      return;
    }
    if ((event.relatedTarget as Element)?.className === 'add-subtask') {
      return;
    }
    this.task.subTasks!.pop();
  }
  nameFieldBlur() {
    if (this.task.name && !this.nameInput) {
      this.nameInput = this.task.name;
      return;
    }
    if (this.nameInput) {
      this.task.name = this.nameInput;
    }
  }
  notesInputBlur() {
    this.task.notes = this.notesInput;
  }
  checkBoxChanged(index: number, condition: boolean) {
    let subTasks = [...this.task.subTasks!];
    let modifiedSubTask = { ...subTasks[index], done: condition };
    subTasks[index] = modifiedSubTask;
    this.task = { ...this.task, subTasks: subTasks };
  }
  deleteSubtask(index: number) {
    let subTasks = [...this.task.subTasks!];
    subTasks.splice(index, 1);
    this.subTaskNames[index] = '';
    this.task = { ...this.task, subTasks: subTasks };
  }
  saveChanges() {
    this.tasksService.modifyTask({ ...this.task });
    if (this.matDialogRef) {
      this.matDialogRef.close({ type: 'modify', task: this.task });
      return;
    }
  }
  taskDelete() {
    let dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
      panelClass: 'change-task-property-modal',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tasksService.deleteTask(this.task.creationTime);
        if (this.matDialogRef) {
          this.matDialogRef.close({ type: 'delete', task: this.task });
        }
      }
    });
  }
  onOpenDialog(type: string) {
    let dialogRef = this.matDialog.open(EditModalComponent, {
      data:
        type === 'lists'
          ? { type: 'lists', data: this.lists, current: this.task.list }
          : {
              type: 'priority',
              data: this.priorities,
              current: this.task.priority,
            },
      panelClass: 'change-task-property-modal',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.type === 'list') {
          this.task.list = result.data;
        } else if (result.type === 'priority') {
          this.task.priority = result.data;
        }
        this.cdRef.detectChanges();
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
