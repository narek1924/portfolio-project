import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SideBarService } from './side-bar.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit, OnDestroy {
  keepOpen!: boolean;
  subscription!: Subscription;
  constructor(private sbService: SideBarService) {}

  ngOnInit(): void {
    this.subscription = this.sbService.keepOpen.subscribe(
      (condition) => (this.keepOpen = condition)
    );
  }
  keepOpentoggle() {
    this.sbService.keepOpenToggle(!this.keepOpen);
    if (!this.keepOpen) {
      this.sbService.sideBarToggle(false);
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
