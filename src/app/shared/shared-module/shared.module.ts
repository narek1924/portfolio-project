import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditModalComponent } from 'src/app/tasks/task-edit/edit-modal/edit-modal.component';
import { TaskEditComponent } from 'src/app/tasks/task-edit/task-edit.component';
import { LoadingSpinnerSmallComponent } from '../loading-spinner/loading-spinner-small/loading-spinner-small.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { DateSortPipe } from '../pipes/date-sort.pipe';
import { SortPipe } from '../pipes/sort.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { TextareaExpandDirective } from '../textarea-expand.directive';
import { CreateListModalComponent } from 'src/app/side-bar/create-list-modal/create-list-modal.component';
import { ConfirmDeleteComponent } from 'src/app/tasks/task-edit/confirm-delete/confirm-delete.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { FilterPipe } from '../pipes/filter.pipe';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    LoadingSpinnerSmallComponent,
    SortPipe,
    DateSortPipe,
    FilterPipe,
    TaskEditComponent,
    EditModalComponent,
    TextareaExpandDirective,
    CreateListModalComponent,
    ConfirmDeleteComponent,
    ErrorModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    HttpClientModule,
  ],
  exports: [
    LoadingSpinnerComponent,
    LoadingSpinnerSmallComponent,
    SortPipe,
    DateSortPipe,
    FilterPipe,
    TaskEditComponent,
    EditModalComponent,
    CreateListModalComponent,
    TextareaExpandDirective,
    ConfirmDeleteComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    HttpClientModule,
  ],
})
export class SharedModule {}
