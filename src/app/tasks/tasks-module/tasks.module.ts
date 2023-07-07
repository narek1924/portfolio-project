import { NgModule } from '@angular/core';
import { NextSevenDaysComponent } from '../next-seven-days/next-seven-days.component';
import { TasksListComponent } from '../tasks-list/tasks-list.component';
import { TasksComponent } from '../tasks.component';
import { FilterByListPipe } from 'src/app/shared/pipes/filter-by-list.pipe';
import { TaskListSortPipe } from 'src/app/shared/pipes/task-list-sort.pipe';
import { TasksWrapperComponent } from '../tasks-list/tasks-wrapper/tasks-wrapper.component';
import { SharedModule } from 'src/app/shared/shared-module/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TasksComponent,
    NextSevenDaysComponent,
    TasksListComponent,
    FilterByListPipe,
    TaskListSortPipe,
    TasksWrapperComponent,
  ],
  imports: [SharedModule, TasksRoutingModule],
  exports: [],
})
export class TasksModule {}
