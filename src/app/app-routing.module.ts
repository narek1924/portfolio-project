import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyDayComponent } from './my-day/my-day.component';
import { AuthComponent } from './auth/auth/auth.component';
import { AuthGuard } from './auth/auth/auth.guard';
import { LoginGuard } from './auth/auth/login.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/my-day',
  },
  {
    path: 'auth',
    loadChildren: () => {
      return import('./auth/auth/auth.module').then((m) => m.AuthModule);
    },
  },
  { path: 'my-day', component: MyDayComponent, canActivate: [AuthGuard] },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./tasks/tasks-module/tasks.module').then((m) => m.TasksModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
