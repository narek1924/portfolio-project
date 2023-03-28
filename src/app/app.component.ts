import {
  trigger,
  transition,
  animate,
  style,
  keyframes,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SideBarService } from './side-bar/side-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('settings', [
      transition(
        ':leave',
        animate(
          '310ms',
          keyframes([
            style({ visibility: 'visible', offset: 0.99 }),
            style({ visibility: 'hidden', offset: 1 }),
          ])
        )
      ),
    ]),
  ],
})
export class AppComponent implements OnInit {
  isOpened!: boolean;
  constructor(private sbService: SideBarService) {}

  ngOnInit(): void {
    this.sbService.isOpened.subscribe(
      (condition) => (this.isOpened = condition)
    );
  }
}
