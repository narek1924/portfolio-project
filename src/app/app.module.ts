import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MyDayComponent } from './my-day/my-day.component';
import { MainPageComponent } from './main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyDayContentComponent } from './my-day/my-day-content/my-day-content.component';
import { TaskCardComponent } from './my-day/my-day-content/task-card/task-card.component';
import { HamburgerMenuComponent } from './main-page/hamburger-menu/hamburger-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    MyDayComponent,
    MainPageComponent,
    MyDayContentComponent,
    TaskCardComponent,
    HamburgerMenuComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
