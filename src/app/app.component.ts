import { Component, OnInit } from '@angular/core';
import { SideBarService } from './side-bar/side-bar.service';
import { settingsIconAnimation } from './shared/animations';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth/auth/auth.service';
import { DataStorageService } from './shared/data-storage-service/data-storage.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [settingsIconAnimation],
})
export class AppComponent implements OnInit {
  loading = false;
  isLogedIn = false;
  isMyDay!: boolean;
  isOpened!: boolean;
  suggestionsOpened!: boolean;
  imageUrl!: string;
  firstVisit = false;
  isSmallScreen$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, '(max-width: 768px)'])
    .pipe(map((result: any) => result.matches));
  constructor(
    private sbService: SideBarService,
    private router: Router,
    private authService: AuthService,
    private dataService: DataStorageService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.authService.firstVisit.subscribe((condition) => {
      this.firstVisit = condition;
    });
    this.dataService.fetching.subscribe((condition) => {
      this.loading = condition;
    });
    this.authService.autoLogin();
    this.sbService.isOpened.subscribe(
      (condition) => (this.isOpened = condition)
    );
    this.sbService.suggestions.subscribe((condition) => {
      this.suggestionsOpened = condition;
    });
    this.authService.user.subscribe((user) => (this.isLogedIn = !!user));
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMyDay = this.router.url === '/my-day';

        if (!this.isMyDay) {
          this.sbService.suggestionsToggle(false);
        }
      }
    });
    this.dataService.profileImage.subscribe(
      (imageUrl) => (this.imageUrl = imageUrl)
    );
  }
  toggle() {
    this.isSmallScreen$.pipe(take(1)).subscribe((condition) => {
      if (condition) {
        this.sbService.sideBarToggle(true);
      }
    });
  }
  suggestionsToggle() {
    this.sbService.suggestionsToggle(!this.suggestionsOpened);
  }
}
