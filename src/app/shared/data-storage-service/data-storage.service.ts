import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, exhaustMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../app-state/reducers';
import * as fromAppStateActions from '../app-state/app-state-actions';
import { Task } from '../interfaces/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

export interface userData {
  name: string;
  tasks: Task[];
  lists: string[];
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  fetching = new BehaviorSubject(true);
  profileImage = new BehaviorSubject<string>(null as any);
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private matDialog: MatDialog
  ) {}

  createUser(id: string, name: string) {
    this.fetching.next(true);
    let capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    this.store.dispatch(new fromAppStateActions.addName(capitalizedName));
    this.store.dispatch(
      new fromAppStateActions.fetchLists(['Personal', 'Groccery list', 'Work'])
    );
    return this.http.put(
      'https://portfolio-project-12-default-rtdb.firebaseio.com/users/' +
        id +
        '.json',
      {
        name: capitalizedName,
        tasks: [],
        lists: ['Personal', 'Grocery list', 'Work'],
      }
    );
  }
  deleteUser(id: string) {
    return this.http.delete(
      'https://portfolio-project-12-default-rtdb.firebaseio.com/users/' +
        id +
        '.json'
    );
  }
  fetchData(id: string) {
    this.fetching.next(true);
    return this.http
      .get<userData>(
        'https://portfolio-project-12-default-rtdb.firebaseio.com/users/' +
          id +
          '.json'
      )
      .pipe(
        tap((data) => {
          this.store.dispatch(new fromAppStateActions.addName(data.name));
          if (data.tasks) {
            this.store.dispatch(new fromAppStateActions.fetchTasks(data.tasks));
          }
          if (data.lists) {
            this.store.dispatch(new fromAppStateActions.fetchLists(data.lists));
          }
          if (data.imageUrl) {
            this.profileImage.next(data.imageUrl);
          }
        })
      );
  }
  changeData(id: string, dataType: string) {
    this.store
      .select('appState')
      .pipe(
        take(1),
        exhaustMap((data) => {
          return this.http.put(
            'https://portfolio-project-12-default-rtdb.firebaseio.com/users/' +
              id +
              '/' +
              dataType +
              '.json',
            dataType === 'tasks'
              ? {
                  ...data.tasks,
                }
              : { ...data.lists }
          );
        })
      )
      .subscribe(
        () => {},
        (error) => {
          this.matDialog.open(ErrorModalComponent, {
            data: 'connection',
            panelClass: 'error-modal',
            disableClose: true,
          });
        }
      );
  }
  changeUsername(id: string, name: string) {
    return this.http
      .patch(
        'https://portfolio-project-12-default-rtdb.firebaseio.com/users/' +
          id +
          '.json',
        {
          name,
        }
      )
      .subscribe(
        () => {},
        (error) => {
          this.matDialog.open(ErrorModalComponent, {
            data: 'connection',
            panelClass: 'error-modal',
            disableClose: true,
          });
        }
      );
  }
  addAvatar(id: string, url: string) {
    this.profileImage.next(url);
    return this.http.patch(
      'https://portfolio-project-12-default-rtdb.firebaseio.com/users/' +
        id +
        '.json',
      {
        imageUrl: url,
      }
    );
  }
}
