import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage-service/data-storage.service';
import { ConfirmDeleteComponent } from 'src/app/tasks/task-edit/confirm-delete/confirm-delete.component';
import { AuthService } from '../auth/auth.service';
import {
  firstStepAnimation,
  nextStepAnimation,
  itemAnimation,
} from 'src/app/shared/animations';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  animations: [firstStepAnimation, nextStepAnimation, itemAnimation],
})
export class AuthFormComponent implements OnInit, AfterViewInit {
  showPassword = false;
  subscription!: Subscription;
  animationDisabled = true;
  registerForm!: FormGroup;
  isRegistered!: boolean;
  firstStep = true;
  passwordReset = false;
  isLoading = false;
  emailSent = false;
  sendingEmail = false;
  error: string = null as any;
  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private dataService: DataStorageService
  ) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, this.customEmailValidator]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngAfterViewInit(): void {
    this.animationDisabled = false;
  }
  googleSignIn() {
    this.authService.signInWithGoogle();
  }
  submitData() {
    let name = this.registerForm.value.name;
    let email = this.registerForm.get('email')?.value;
    let password = this.registerForm.value.password;

    if (this.isRegistered) {
      this.isLoading = true;
      this.authService
        .login(email, password)
        .pipe(take(1))
        .subscribe(
          () => {
            this.isLoading = false;
            this.dataService.fetching.next(false);
            this.router.navigate(['/my-day']);
          },
          (errorMessage) => {
            this.error = errorMessage;
            this.dataService.fetching.next(false);
            this.isLoading = false;
          }
        );
    } else {
      if (!this.registerForm.valid) {
        return;
      }
      this.isLoading = true;
      this.authService
        .signUp(email, password, name)
        .pipe(take(1))
        .subscribe(
          () => {
            this.router.navigate(['/my-day']);
            this.isLoading = false;
            this.authService.firstVisit.next(true);
            this.dataService.fetching.next(false);
          },
          (errorMessage) => {
            this.error = errorMessage;
            this.isLoading = false;
            this.dataService.fetching.next(false);
          }
        );
    }
  }
  checkEmail() {
    this.isLoading = true;
    this.subscription = this.authService
      .checkEmai(this.registerForm.value.email)
      .subscribe((message) => {
        this.isLoading = false;
        this.firstStep = false;
        if (message.registered) {
          this.isRegistered = true;
        } else {
          this.isRegistered = false;
        }
      });

    this.registerForm.get('email')?.disable();
  }
  resetPassword() {
    this.passwordReset = true;
  }
  backToFirstStep() {
    let dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
      data: {
        data: 'auth',
      },
      panelClass: 'change-task-property-modal',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.firstStep = true;
        this.isRegistered = null as any;
        this.registerForm.get('email')?.enable();
        this.registerForm.reset();
        this.error = null as any;
      }
    });
  }
  sendResetEmail() {
    this.sendingEmail = true;
    this.authService
      .sendResetEmail(this.registerForm.get('email')?.value)
      .subscribe((data) => {
        this.sendingEmail = false;
        this.emailSent = true;
      });
  }
  backToAuth() {
    this.passwordReset = false;
    this.emailSent = false;
  }
  counter(n: number): number[] {
    return Array(n);
  }
  customEmailValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const trimmedValue = control.value?.trim();

    if (
      trimmedValue &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/.test(trimmedValue)
    ) {
      return { invalidEmail: true };
    }

    return null;
  }
}
