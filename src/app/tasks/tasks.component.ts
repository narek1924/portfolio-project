import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TaskEditService } from './task-edit/task-list.service';

import { ConfirmDeleteComponent } from './task-edit/confirm-delete/confirm-delete.component';
import { EditModalComponent } from './task-edit/edit-modal/edit-modal.component';
import { AppState } from '../shared/app-state/reducers';
import { priorityStatus } from '../shared/interfaces/task.interface';
import { TasksStateService } from '../shared/app-state/tasks-state.service';
import { fadeInAnimation, openCloseAnimation } from '../shared/animations';
import { SideBarService } from '../side-bar/side-bar.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  animations: [openCloseAnimation, fadeInAnimation],
})
export class TasksComponent implements OnInit {
  lists!: string[];
  priorities!: priorityStatus[];
  multiSelect!: Boolean;
  selectedItemsCount!: number;
  clearCompletedButton!: boolean;
  pageTitle!: string;
  listMenu!: Boolean;
  sideBarOpen!: boolean;
  subscription = new Subscription();
  isSmallScreen$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, '(max-width: 768px)'])
    .pipe(map((result: any) => result.matches));
  constructor(
    private sbService: SideBarService,
    private taskListService: TaskEditService,
    private tasksStateService: TasksStateService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver
  ) {}
  ngOnInit(): void {
    this.subscription.add(
      this.sbService.isOpened.subscribe(
        (condition) => (this.sideBarOpen = condition)
      )
    );

    this.subscription.add(
      this.taskListService.pageTitle.subscribe((title) => {
        this.pageTitle = title;
        this.cdr.detectChanges();
      })
    );
    this.subscription.add(
      this.taskListService.listMenu.subscribe((condition) => {
        this.listMenu = condition;
      })
    );
    this.subscription.add(
      this.taskListService.clearCompletedButton.subscribe((condition) => {
        this.clearCompletedButton = condition;
      })
    );
    this.subscription.add(
      this.taskListService.multiSelect.subscribe((condition) => {
        this.multiSelect = condition;
      })
    );
    this.subscription.add(
      this.taskListService.taskArrayLength.subscribe((length) => {
        this.selectedItemsCount = length;
      })
    );
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.taskListService.multiSelect.next(false);
          this.taskListService.taskArrayLength.next(0);
          this.taskListService.resetTaskArray();
        }
      })
    );
    this.subscription.add(
      this.store.select('appState').subscribe((data) => {
        this.lists = data.lists;
        this.priorities = data.priorityStatuses;
      })
    );
  }
  clearDoneTasks() {
    if (this.multiSelect) {
      return;
    }
    if (this.clearCompletedButton) {
      this.taskListService.clearDoneTasks.next(true);
    }
  }
  deleteList() {
    if (this.lists.length > 1) {
      let dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
        data: {
          data: 'list',
        },
        panelClass: 'change-task-property-modal',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.tasksStateService.deleteList(this.pageTitle);
          this.router.navigate(['lists', this.lists[0]], {
            relativeTo: this.route,
          });
        }
      });
    }
  }
  deleteSelectedTasks() {
    let dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
      data: {
        data: this.selectedItemsCount,
      },
      panelClass: 'change-task-property-modal',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskListService.deleteSelectedTasks();
      }
    });
  }
  markAsDone() {
    this.taskListService.markAsDone();
  }
  selectedTasksLists() {
    let dialogRef = this.matDialog.open(EditModalComponent, {
      data: { type: 'lists', data: this.lists },
      panelClass: 'change-task-property-modal',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.taskListService.changeList(data.data);
      }
    });
  }
  selectedTasksPriority() {
    let dialogRef = this.matDialog.open(EditModalComponent, {
      data: { type: 'priority', data: this.priorities },
      panelClass: 'change-task-property-modal',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.taskListService.changePriorityStatus(data.data);
      }
    });
  }
  multiSelectToggle() {
    this.taskListService.multiSelect.next(!this.multiSelect);
    this.taskListService.resetTaskArray();
  }
}
