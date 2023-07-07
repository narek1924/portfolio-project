import { AfterViewInit, Component, OnInit } from '@angular/core';
import { decorationAnimation, firstStepAnimation } from '../shared/animations';
import { TasksStateService } from '../shared/app-state/tasks-state.service';
import { AuthService } from '../auth/auth/auth.service';
import { AppState } from '../shared/app-state/reducers';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-first-visit',
  templateUrl: './first-visit.component.html',
  styleUrls: ['./first-visit.component.scss'],
  animations: [firstStepAnimation, decorationAnimation],
})
export class FirstVisitComponent implements AfterViewInit, OnInit {
  taskTitles: string[] = ['', '', ''];
  animationDisabled = true;
  username!: string;
  greetingTime!: string;
  subscription!: Subscription;
  constructor(
    private tasksService: TasksStateService,
    private authService: AuthService,
    private store: Store<AppState>
  ) {}
  ngOnInit(): void {
    this.subscription = this.store
      .select('appState')
      .subscribe((data) => (this.username = data.name));
    let time = new Date().getHours();
    if (time <= 12 && time >= 4) {
      this.greetingTime = 'Morning';
    } else if (time > 12 && time <= 18) {
      this.greetingTime = 'Afternoon';
    } else if (time > 18 || time < 4) {
      this.greetingTime = 'Evening';
    }
  }
  ngAfterViewInit(): void {
    this.animationDisabled = false;
  }
  skip() {
    this.tasksService.addTask({
      name: 'Add your first task',
      creationTime: new Date(),
      myDay: true,
      done: false,
    });
    this.authService.firstVisit.next(false);
  }
  continue() {
    this.taskTitles.map((input, index) => {
      if (input) {
        this.tasksService.addTask({
          name: input,
          creationTime: new Date(new Date().getTime() + index),
          myDay: true,
          done: false,
        });
      }
    });
    this.authService.firstVisit.next(false);
  }
  fillInput(option: number) {
    let emptyIndex = this.taskTitles.findIndex((input) => !input);
    if (emptyIndex !== -1) {
      switch (option) {
        case 0: {
          this.taskTitles[emptyIndex] = 'Do laundry';
          break;
        }
        case 1: {
          this.taskTitles[emptyIndex] = 'Call back';
          break;
        }
        case 2: {
          this.taskTitles[emptyIndex] = 'Plan a trip to';
          break;
        }
        case 3: {
          this.taskTitles[emptyIndex] = 'But birthday gift for';
          break;
        }
      }
    }
  }
  checkInputs(method: string) {
    if (method === 'every') {
      return this.taskTitles.every((task) => !task);
    } else {
      return this.taskTitles.some((task) => !task);
    }
  }
}
