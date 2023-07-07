import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Subject,
  catchError,
  exhaustMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

import { User } from './user.model';
import { Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage-service/data-storage.service';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, storage } from 'src/app/firebase-config';
import { getDownloadURL, ref } from 'firebase/storage';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: number;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null as any);
  tokenExpirationTimer!: any;
  firstVisit = new Subject<boolean>();
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataStorageService,
    private matDialog: MatDialog
  ) {}
  signUp(email: string, password: string, name: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebase.apiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes) => this.handleError(errorRes)),
        tap((responseData: AuthResponseData) => {
          this.handleAuthentification(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            responseData.expiresIn
          );
        }),
        exhaustMap((responseData) => {
          return this.dataService.createUser(responseData.localId, name);
        })
      );
  }
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        let email = result.user!.email;
        let id = result.user!.uid;
        //@ts-ignore
        let token = result.user.accessToken;
        let name = result.user?.displayName;
        this.dataService.fetching.next(true);

        this.handleAuthentification(email!, id, token, 3600);
        this.dataService.addAvatar(id, result.user.photoURL!);
        this.http
          .get(
            'https://portfolio-project-12-default-rtdb.firebaseio.com/users/' +
              id +
              '.json'
          )
          .pipe(take(1))
          .subscribe(
            (data) => {
              if (data) {
                this.dataService
                  .fetchData(id)
                  .pipe(take(1))
                  .subscribe(() => {
                    this.dataService.fetching.next(false);
                    this.router.navigate(['/my-day']);
                  });
              } else {
                this.dataService
                  .createUser(id, name!)
                  .pipe(
                    take(1),
                    tap(() => this.firstVisit.next(true)),
                    exhaustMap(() =>
                      this.dataService.addAvatar(id, result.user.photoURL!)
                    ),
                    take(1)
                  )
                  .subscribe((data) => {
                    this.dataService.fetching.next(false);
                    this.router.navigate(['/my-day']);
                  });
              }
            },
            (error) => {
              console.log(error);
            }
          );
      })
      .catch((error) => {});
  }
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebase.apiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes: HttpErrorResponse) => this.handleError(errorRes)),
        tap((responseData) => {
          this.handleAuthentification(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            responseData.expiresIn
          );
        }),
        exhaustMap((responseData) => {
          return this.dataService.fetchData(responseData.localId);
        })
      );
  }
  logout() {
    this.user.next(null as any);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.matDialog.closeAll();
    this.dataService.profileImage.next(null as any);
  }
  autoLogin() {
    const userJson = localStorage.getItem('userData');

    if (userJson === null) {
      this.dataService.fetching.next(false);
      return;
    }
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
      imagePath?: string;
    } = JSON.parse(userJson);
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      let expirationTimer =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationTimer);
      this.dataService.fetchData(loadedUser.id).subscribe((data) => {
        this.dataService.fetching.next(false);
      });
    } else {
      this.dataService.fetching.next(false);
    }
  }
  private autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationDuration
    );
  }
  checkEmai(email: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=' +
        environment.firebase.apiKey,
      {
        identifier: email,
        continueUri: 'http://localhost:4200/auth',
      }
    );
  }
  deleteAccount() {
    let token!: string;
    let id!: string;
    this.user.pipe(take(1)).subscribe((user) => {
      token = user.token!;
      id = user.id;
    });

    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:delete?key=' +
          environment.firebase.apiKey,
        {
          idToken: token,
        }
      )
      .pipe(
        exhaustMap(() => {
          return this.dataService.deleteUser(id);
        })
      )
      .subscribe((data) => {
        this.logout();
      });
  }
  sendResetEmail(email: string) {
    return this.http.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' +
        environment.firebase.apiKey,
      {
        requestType: 'PASSWORD_RESET',
        email: email,
      }
    );
  }
  private handleAuthentification(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const user = new User(
      email,
      id,
      token,
      new Date(new Date().getTime() + expiresIn * 1000)
    );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage!: string;
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      default: {
        errorMessage = errorRes.error.error.message;
      }
    }
    return throwError(errorMessage);
  }
}
