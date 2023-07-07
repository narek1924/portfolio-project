import { Component, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { SideBarService } from '../side-bar/side-bar.service';
import { openCloseAnimation } from '../shared/animations';
import { AuthService } from '../auth/auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  animations: [openCloseAnimation],
})
export class MainPageComponent implements OnInit {
  isLogedIn = false;
  timer = null as any;
  sideBarOpeningTimer?: any;
  isMobile!: boolean;
  keepOpen!: boolean;
  isOpened?: boolean;
  suggestions?: boolean;
  dragging!: boolean;
  subscriptions = new Subscription();
  isSmallScreen$ = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(map((result: any) => result.matches));
  constructor(
    private SbService: SideBarService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.SbService.isOpened.subscribe(
        (condition) => (this.isOpened = condition)
      )
    );
    this.subscriptions.add(
      this.SbService.keepOpen.subscribe(
        (condition) => (this.keepOpen = condition)
      )
    );
    this.subscriptions.add(
      this.SbService.suggestions.subscribe(
        (condition) => (this.suggestions = condition)
      )
    );
    this.subscriptions.add(
      this.authService.user.subscribe((user) => {
        this.isLogedIn = !!user;
      })
    );
    this.subscriptions.add(
      this.SbService.drag.subscribe((condition) => (this.dragging = condition))
    );
  }
  toggle(event: MouseEvent) {
    if (!this.isLogedIn) {
      return;
    }
    if (!this.keepOpen && !this.timer) {
      if (event.type === 'mouseenter') {
        if (this.dragging) {
          return;
        }
        this.SbService.sideBarToggle(true);
      }
      if (event.type === 'mouseleave') {
        if (
          event.relatedTarget &&
          ((event.relatedTarget as HTMLElement).className.split(' ')[0] ===
            'settings-wrapper' ||
            (event.relatedTarget as HTMLElement).className.split(' ')[1] ===
              'avatar')
        ) {
          return;
        }

        this.SbService.sideBarToggle(false);
      }
      this.timer = setTimeout(() => {
        this.timer = null as any;
      }, 200);
    }
  }
  close() {
    this.SbService.sideBarToggle(false);
    this.SbService.keepOpenToggle(false);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
