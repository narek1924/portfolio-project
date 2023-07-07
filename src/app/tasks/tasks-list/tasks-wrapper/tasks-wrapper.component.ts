import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TasksWithDate } from '../interfaces';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/app-state/reducers';
import { TaskEditService } from '../../task-edit/task-list.service';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';
import { taskAutoSelect } from 'src/app/shared/functions';
import { tasksWrapperAnimation } from 'src/app/shared/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-tasks-wrapper',
  templateUrl: './tasks-wrapper.component.html',
  styleUrls: ['./tasks-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [tasksWrapperAnimation],
})
export class TasksWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
  tasksWithDate: TasksWithDate[] = [
    { day: 'Today', show: true },
    { day: 'Tomorrow', show: true },
    { day: 'Upcoming', show: true },
  ];
  subscription = new Subscription();
  tasks!: Task[];
  filterParam!: string | null;
  multiSelect!: boolean;
  animationDisabled = true;
  selectedTasks: Date[] = [];
  selectedTaskDate!: Date;
  constructor(
    private store: Store<AppState>,
    private taskListService: TaskEditService,
    private tasksService: TasksStateService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.animationDisabled = false;
      this.cdRef.detectChanges();
    }, 0);

    let routeParam = this.route.snapshot.params['list-type'];

    if (routeParam === 'all') {
      this.taskListService.pageTitle.next('All my tasks');
      this.taskListService.listMenu.next(false);
      this.taskListService.filterParam.next(null);
    } else {
      this.taskListService.filterParam.next(routeParam);

      this.taskListService.pageTitle.next(routeParam);
      this.taskListService.listMenu.next(true);
    }
    this.subscription.add(
      this.taskListService.filterParam.subscribe((title) => {
        this.filterParam = title;
      })
    );
    this.subscription.add(
      this.store.select('appState').subscribe((data) => {
        this.tasks = [...data.tasks];

        if (
          this.tasks.filter((task) =>
            this.filterParam ? task.list === this.filterParam : true
          ).length
        ) {
          this.taskListService.taskToEdit.next(true);
          taskAutoSelect(
            this.tasks,
            this.taskListService,
            this.filterParam ? this.filterParam : ''
          );
          this.cdRef.detectChanges();
        } else {
          this.taskListService.taskToEdit.next(false);
          this.cdRef.detectChanges();
          this.taskListService.clearCompletedButton.next(false);
        }
      })
    );

    this.subscription.add(
      this.taskListService.task.subscribe((task) => {
        this.selectedTaskDate = task.creationTime;
        this.cdRef.detectChanges();
      })
    );
    this.subscription.add(
      this.taskListService.multiSelect.subscribe(
        (condition) => (this.multiSelect = condition)
      )
    );
    this.subscription.add(
      this.taskListService.taskChanged.subscribe((tasks) => {
        this.selectedTasks = tasks;
        this.cdRef.detectChanges();
      })
    );
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let routeParam = this.route.snapshot.params['list-type'];
          if (routeParam === 'all') {
            this.taskListService.pageTitle.next('All my tasks');
            this.taskListService.listMenu.next(false);
            this.taskListService.filterParam.next(null);

            if (this.tasks.length) {
              this.taskListService.taskToEdit.next(true);
              taskAutoSelect(
                this.tasks,
                this.taskListService,
                this.filterParam
              );
              this.cdRef.detectChanges();
            } else {
              this.taskListService.taskToEdit.next(false);
              this.taskListService.clearCompletedButton.next(false);
              this.cdRef.detectChanges();
            }
          } else {
            this.taskListService.pageTitle.next(routeParam);
            this.taskListService.listMenu.next(true);
            this.taskListService.filterParam.next(routeParam);

            this.cdRef.detectChanges();
            if (
              this.tasks.filter((task) => task.list === this.filterParam).length
            ) {
              this.taskListService.taskToEdit.next(true);
              taskAutoSelect(
                this.tasks,
                this.taskListService,
                this.filterParam
              );
              this.cdRef.detectChanges();
            } else {
              this.taskListService.taskToEdit.next(false);
              this.taskListService.clearCompletedButton.next(false);
              this.cdRef.detectChanges();
            }
          }
        }
      })
    );
    this.subscription.add(
      this.taskListService.clearDoneTasks.subscribe((action) => {
        let array: Date[] = [];
        this.tasks
          .filter((task) =>
            this.filterParam ? task.list === this.filterParam : true
          )
          .map((task) => task.done && array.push(task.creationTime));
        this.tasksService.deleteTask(array);
      })
    );
    this.subscription.add(
      this.taskListService.task.subscribe(
        (task) => (this.selectedTaskDate = task.creationTime)
      )
    );
    this.subscription.add(
      this.taskListService.deleteTask.subscribe((task) => {
        this.deleteTask(task);
      })
    );
  }
  ngAfterViewInit(): void {
    // this.animationDisabled = false;
  }

  onEdit(task: Task) {
    if (this.multiSelect) {
      if (!task.done) {
        this.taskListService.selectTask(task.creationTime);
      }
      return;
    }
    this.taskListService.task.next(task);
  }
  onCheckboxChange(task: Task, event: Event) {
    this.tasksService.changeDoneStatus({
      condition: (event.target as HTMLInputElement).checked,
      date: task.creationTime,
    });
  }
  deleteTask(task: Task) {
    if (this.multiSelect) {
      return;
    }
    this.tasksService.deleteTask(task.creationTime);
    taskAutoSelect(this.tasks, this.taskListService, this.filterParam);
    this.cdRef.detectChanges();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
