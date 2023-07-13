import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { SideBarService } from './side-bar.service';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/app-state/reducers';
import { CreateListModalComponent } from './create-list-modal/create-list-modal.component';
import { TasksStateService } from '../shared/app-state/tasks-state.service';
import { Task } from '../shared/interfaces/task.interface';
import { ChangeDetectionStrategy } from '@angular/core';
import { ProfileSettingsComponent } from '../auth/auth/profile-settings/profile-settings.component';
import { ErrorModalComponent } from '../shared/error-modal/error-modal.component';
import { listsWrapperAnimation } from '../shared/animations';
import { DataStorageService } from '../shared/data-storage-service/data-storage.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [listsWrapperAnimation],
})
export class SideBarComponent implements OnInit, OnDestroy {
  username!: string;
  name!: string;
  tasksLists!: string[];
  tasks!: Task[];
  keepOpen!: boolean;
  showLists = true;
  imageUrl!: string;
  subscription = new Subscription();
  constructor(
    private sbService: SideBarService,
    private store: Store<AppState>,
    private matDialog: MatDialog,
    private taskService: TasksStateService,
    private dataStorageService: DataStorageService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.select('appState').subscribe((data) => {
        this.tasks = [...data.tasks];
        this.tasksLists = [...data.lists];
        this.username = data.name;
        this.name = data.name.split(' ')[0];
        this.cdRef.detectChanges();
      })
    );
    this.subscription.add(
      this.dataStorageService.profileImage.subscribe((imageUrl) => {
        this.imageUrl = imageUrl;
        setTimeout(() => {
          this.cdRef.detectChanges();
        }, 0);
      })
    );
    this.subscription.add(
      this.sbService.keepOpen.subscribe((condition) => {
        this.keepOpen = condition;
        this.cdRef.detectChanges();
      })
    );
  }
  keepOpentoggle() {
    this.sbService.keepOpenToggle(!this.keepOpen);
    if (!this.keepOpen) {
      this.sbService.sideBarToggle(false);
    }
  }
  createList() {
    let matDialogRef = this.matDialog.open(CreateListModalComponent, {
      panelClass: 'add-list-modal',
    });
    matDialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        let title = data.charAt(0).toUpperCase() + data.slice(1);
        let exists = false;
        this.tasksLists.map((list) => {
          if (list === title) {
            exists = true;
          }
        });
        if (exists) {
          this.matDialog.open(ErrorModalComponent, {
            data: 'list',
            panelClass: 'error-modal',
          });
        } else {
          this.taskService.addList(title);
        }
      }
    });
  }
  profileSettings() {
    this.matDialog.open(ProfileSettingsComponent, {
      panelClass: 'profile-settings-modal',
    });
  }
  myDayTasksLength() {
    return this.tasks.filter((task) => task.myDay).length;
  }
  sevenDaysTasksLength() {
    return this.tasks.filter(
      (task) =>
        task.creationTime <
        new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length;
  }
  listTasksLength(list: string) {
    return this.tasks.filter((task) => task.list === list).length;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
