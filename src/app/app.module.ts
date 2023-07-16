import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MyDayComponent } from './my-day/my-day.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MyDayContentComponent } from './my-day/my-day-content/my-day-content.component';
import { appReducer } from './shared/app-state/reducers';
import { MyDaySuggestionsComponent } from './my-day/my-day-suggestions/my-day-suggestions.component';
import {
  TransitionGroupComponent,
  TransitionGroupItemDirective,
} from './shared/animate.directive';
import { AuthInterceptor } from './auth/auth/auth.interceptor';
import { FetchLoadingComponent } from './shared/fetch-loading/fetch-loading.component';
import { ProfileSettingsComponent } from './auth/auth/profile-settings/profile-settings.component';
import { SharedModule } from './shared/shared-module/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirstVisitComponent } from './first-visit/first-visit.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    MyDayComponent,
    MainPageComponent,
    MyDayContentComponent,
    MyDaySuggestionsComponent,
    TransitionGroupComponent,
    TransitionGroupItemDirective,
    FetchLoadingComponent,
    ProfileSettingsComponent,
    FirstVisitComponent,
  ],
  imports: [
    AppRoutingModule,
    StoreModule.forRoot(appReducer),
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
