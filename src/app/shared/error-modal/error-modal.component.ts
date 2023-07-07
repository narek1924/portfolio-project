import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
})
export class ErrorModalComponent implements OnInit {
  constructor(
    private matDialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: string
  ) {}
  ngOnInit(): void {
    console.log(this.data);
  }
  onClick() {
    if (this.data === 'connection') {
      location.reload();
    } else {
      this.matDialogRef.close();
    }
  }
}
