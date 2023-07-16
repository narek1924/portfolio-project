import { Component } from '@angular/core';
import {
  firstStepAnimation,
  nextStepAnimation,
  itemAnimation,
} from 'src/app/shared/animations';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [firstStepAnimation, nextStepAnimation, itemAnimation],
})
export class AuthComponent {
  constructor() {}
  counter(n: number): number[] {
    return Array(n);
  }
}
