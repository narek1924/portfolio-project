import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceInfo } from 'ngx-device-detector/public-api';
import { Subscription } from 'rxjs';
import { SideBarService } from '../side-bar/side-bar.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'opened',
        style({
          width: '80px',
        })
      ),
      state(
        'closed',
        style({
          width: '0px',
        })
      ),
      transition('closed => opened', [animate('100ms')]),
      transition('opened => closed', [animate('100ms')]),
    ]),
  ],
})
export class MainPageComponent implements OnInit {
  timer = null as any;
  isMobile!: boolean;
  keepOpen!: boolean;
  isOpened?: boolean;
  subscriptions = new Subscription();
  constructor(
    private SbService: SideBarService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();

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
  }
  toggle(event: MouseEvent) {
    if (!this.keepOpen && !this.timer) {
      let condition!: boolean;
      if (event.type === 'mouseenter') {
        condition = true;
      }
      if (
        event.type === 'mouseleave' &&
        (event.relatedTarget as HTMLTextAreaElement)['className'] !==
          'settings-icon'
      ) {
        condition = false;
      }
      if (condition !== undefined) {
        this.SbService.sideBarToggle(condition);
      }
      this.timer = setTimeout(() => {
        this.timer = null as any;
      }, 300);
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
