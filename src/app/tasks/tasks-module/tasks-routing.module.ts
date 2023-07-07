import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth/auth.guard';
import { NextSevenDaysComponent } from '../next-seven-days/next-seven-days.component';
import { TasksListComponent } from '../tasks-list/tasks-list.component';
import { TasksComponent } from '../tasks.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'next-7-days', component: NextSevenDaysComponent },
      { path: 'lists/:list-type', component: TasksListComponent },
    ],
  },
  { path: '**', redirectTo: '/my-day' },
];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class TasksRoutingModule {}
