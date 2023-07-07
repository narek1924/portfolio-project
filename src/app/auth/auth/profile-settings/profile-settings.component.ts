import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { AppState } from 'src/app/shared/app-state/reducers';
import { AuthService } from '../auth.service';

import {
  firstStepAnimation,
  nextStepAnimation,
} from 'src/app/shared/animations';
import { CreateListModalComponent } from 'src/app/side-bar/create-list-modal/create-list-modal.component';
import { TasksStateService } from 'src/app/shared/app-state/tasks-state.service';
import { imagesRef, storage } from 'src/app/firebase-config';
import { DataStorageService } from 'src/app/shared/data-storage-service/data-storage.service';
import { ErrorModalComponent } from 'src/app/shared/error-modal/error-modal.component';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
  animations: [firstStepAnimation, nextStepAnimation],
})
export class ProfileSettingsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  username!: string;
  userEmail!: string;
  deletePage = false;
  changePassword = false;
  subscription = new Subscription();
  animationDisabled = true;
  sendingEmail = false;
  emailSent = false;
  imageUrl!: string;
  imageLoading = false;
  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private matDialog: MatDialog,
    private tasksService: TasksStateService,
    private dataStorageService: DataStorageService
  ) {}
  ngOnInit(): void {
    this.subscription.add(
      this.store
        .select('appState')
        .subscribe((data) => (this.username = data.name))
    );
    this.subscription.add(
      this.authService.user.subscribe((data) => {
        this.userEmail = data.email;
      })
    );
    this.subscription.add(
      this.dataStorageService.profileImage.subscribe(
        (url) => (this.imageUrl = url)
      )
    );
  }
  ngAfterViewInit(): void {
    this.animationDisabled = false;
  }
  editUsername() {
    let matDialogRef = this.matDialog.open(CreateListModalComponent, {
      panelClass: 'add-list-modal',
      data: {
        data: this.username,
      },
    });
    matDialogRef.afterClosed().subscribe((data) => {
      if (data) {
        let name = data.charAt(0).toUpperCase() + data.slice(1);
        this.tasksService.changeName(name);
      }
    });
  }
  logout() {
    this.tasksService.resetTasks();
    this.authService.logout();
  }
  onDelete() {
    this.deletePage = true;
  }
  onPasswordChange() {
    this.changePassword = true;
  }
  deleteAccount() {
    this.authService.deleteAccount();
  }
  resetPassword() {
    this.sendingEmail = true;
    this.authService.sendResetEmail(this.userEmail).subscribe((data) => {
      this.sendingEmail = false;
      this.emailSent = true;
    });
  }
  backToSettings(page: string) {
    if (page === 'reset') {
      this.emailSent = false;
      this.changePassword = false;
    } else {
      this.deletePage = false;
    }
  }
  imageSelect(event: any) {
    this.imageLoading = true;
    let image = event.target!.files[0];
    this.authService.user.pipe(take(1)).subscribe((user) => {
      uploadBytes(ref(storage, user.id), image).then((snapshot) => {
        getDownloadURL(ref(storage, user.id))
          .then((url) => {
            this.dataStorageService.addAvatar(user.id, url).subscribe(
              () => {
                this.imageLoading = false;
              },
              (error) => {
                this.matDialog.open(ErrorModalComponent, {
                  data: 'connection',
                  panelClass: 'error-modal',
                  disableClose: true,
                });
              }
            );

            // Or inserted into an <img> element
          })
          .catch((error) => {
            // Handle any errors
          });
      });
    });
  }
  ngOnDestroy(): void {}
}
