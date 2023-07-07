import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragStart,
  CdkDropList,
} from '@angular/cdk/drag-drop';

import { AppState } from 'src/app/shared/app-state/reducers';
import { Task, priorityStatus } from 'src/app/shared/interfaces/task.interface';
import { listAnimation } from 'src/app/shared/animations';
import { drop, sevenDaysSort } from 'src/app/shared/functions';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { TaskEditService } from '../task-edit/task-list.service';
import { SideBarService } from 'src/app/side-bar/side-bar.service';
interface TasksCard {
  day: string[];
  tasks: Task[];
}

@Component({
  selector: 'app-next-seven-days',
  templateUrl: './next-seven-days.component.html',
  styleUrls: ['./next-seven-days.component.scss'],
  animations: [listAnimation],
})
export class NextSevenDaysComponent implements OnInit, OnDestroy {
  // @ViewChildren(AnimateDirective) items!: QueryList<AnimateDirective>;
  @ViewChildren(CdkDrag) dragItems!: QueryList<CdkDrag>;
  @ViewChild(CdkDropList) dropList!: CdkDropList;
  multiSelect!: boolean;
  selectedTasks: Date[] = [];
  subscription = new Subscription();
  @ViewChild('tasksWrapper', { static: false }) tasksWrapper!: ElementRef;
  wrapperArray: TasksCard[] = [];
  inputArray: string[] = [];
  focusedInputIndexes: number[] = [];
  animationDisabled: boolean = false;
  lists!: string[];
  constructor(
    private store: Store<AppState>,
    private tasksService: TasksStateService,
    private matDialog: MatDialog,
    private taskEditService: TaskEditService,
    private sbService: SideBarService
  ) {}
  ngOnInit(): void {
    this.taskEditService.pageTitle.next('Next 7 days');
    this.taskEditService.listMenu.next(false);
    let array!: Task[];
    this.subscription.add(
      this.store.select('appState').subscribe((data) => {
        array = [...data.tasks];
        this.lists = [...data.lists];
        let clearButton = array.some((task) => task.done);
        this.taskEditService.clearCompletedButton.next(clearButton);
      })
    );
    for (let i = 0; i < 7; i++) {
      sevenDaysSort(array, this.wrapperArray, i);
    }
    this.subscription.add(
      this.taskEditService.clearDoneTasks.subscribe((action) => {
        let array: Date[] = [];
        this.wrapperArray.map((wrapper) =>
          wrapper.tasks.map(
            (task) => task.done && array.push(task.creationTime)
          )
        );
        this.tasksService.deleteTask(array);
        this.deleteTask(array);
      })
    );
    this.subscription.add(
      this.taskEditService.multiSelect.subscribe(
        (condition) => (this.multiSelect = condition)
      )
    );
    this.subscription.add(
      this.taskEditService.taskChanged.subscribe((array) => {
        this.selectedTasks = array;
      })
    );
    this.subscription.add(
      this.taskEditService.deleteTasks.subscribe((action) =>
        this.deleteTask(this.selectedTasks)
      )
    );
    this.subscription.add(
      this.taskEditService.changeTaskProperty.subscribe((data: any) =>
        this.multiSelectChange(data.property, data.value, this.selectedTasks)
      )
    );
  }
  onAddTask(index: number, textArea: HTMLTextAreaElement) {
    let title = this.inputArray[index].trim();

    if (title) {
      let date = new Date(new Date().getTime() + index * 24 * 60 * 60 * 1000);
      let task = new Task(title, date, this.lists[0], false, false);
      this.wrapperArray[index].tasks.unshift(task);

      this.tasksService.addTask({
        name: title,
        creationTime: date,
        myDay: false,
        done: false,
      });
      this.inputArray[index] = '';
      textArea.focus();
    }
  }
  onBlur(index: number) {
    let item = this.inputArray[index];
    if (item && item.trim()) {
      return;
    }
    if (!item || !item.trim()) {
      this.focusedInputIndexes.map((v, i) => {
        if (v === index) {
          delete this.focusedInputIndexes[i];
        }
      });
    }
  }
  drop(event: CdkDragDrop<Task[]>, index: number) {
    this.sbService.drag.next(false);

    drop(event);

    let daysCount =
      +event.container.id.split('-').slice(-1) -
      +event.previousContainer.id.split('-').slice(-1);
    let date = new Date();
    this.wrapperArray[index].tasks.map((v, i, a) => {
      if (
        v.creationTime === event.container.data[event.currentIndex].creationTime
      ) {
        if (
          Number(v.creationTime) - Number(new Date()) < 0 &&
          moment(v.creationTime).calendar().split(' ')[0] !== 'Today'
        ) {
          let modifiedDate = new Date(
            new Date().getTime() + daysCount * 24 * 60 * 60 * 1000
          );
          this.tasksService.changeDate({
            days: daysCount,
            date: v.creationTime,
            modifiedDate: modifiedDate,
          });
          a[i] = {
            ...a[i],
            overDue: false,
            creationTime: modifiedDate,
          };
          return;
        }
        let modifiedDate = new Date(
          v.creationTime.getTime() + daysCount * 24 * 60 * 60 * 1000
        );

        this.tasksService.changeDate({
          days: daysCount,
          date: v.creationTime,
          modifiedDate: modifiedDate,
        });
        a[i] = {
          ...a[i],
          creationTime: modifiedDate,
        };
      }
    });
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
        this.wrapperArray.map((wrapper) =>
          wrapper.tasks.map((v, i) => {
            if (result.task.creationTime === v.creationTime) {
              let array = [...wrapper.tasks];
              array[i] = { ...result.task };
              wrapper.tasks = [...array];
            }
          })
        );
      }
    });
  }
  onCheckboxChange(wrapper: TasksCard, task: Task, event: Event) {
    if (this.multiSelect) {
      return;
    }
    let oldIndex = wrapper.tasks.findIndex(
      (item) => task.creationTime === item.creationTime
    );

    wrapper.tasks[oldIndex] = {
      ...wrapper.tasks[oldIndex],
      done: (event.target as HTMLInputElement).checked,
    };

    wrapper.tasks = wrapper.tasks.slice();
    this.tasksService.changeDoneStatus({
      condition: (event.target as HTMLInputElement).checked,
      date: wrapper.tasks[oldIndex].creationTime,
    });
  }
  deleteTask(date: Date | Date[]) {
    if (Array.isArray(date)) {
      this.wrapperArray.map((wrapper) =>
        wrapper.tasks.map(() => {
          wrapper.tasks = wrapper.tasks.filter(
            (task) => !date.includes(task.creationTime)
          );
        })
      );
      return;
    }
    this.tasksService.deleteTask(date);
    this.wrapperArray.map((wrapper) =>
      wrapper.tasks.map((v) => {
        if (v.creationTime === date) {
          wrapper.tasks = wrapper.tasks.filter(
            (task) => task.creationTime !== date
          );
        }
      })
    );
  }
  multiSelectChange(
    property: string,
    value: string | priorityStatus | boolean,
    date: Date[]
  ) {
    this.wrapperArray.map((wrapper) =>
      wrapper.tasks.map((v, i, a) => {
        if (date.includes(v.creationTime)) {
          a[i] = { ...a[i], [property]: value };
        }
      })
    );
  }
  onDragStarted(event: CdkDragStart) {
    this.sbService.drag.next(true);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
