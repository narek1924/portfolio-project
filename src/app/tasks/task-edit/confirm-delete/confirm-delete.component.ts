import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss'],
})
export class ConfirmDeleteComponent {
  constructor(
    private matDialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public info: {
      data: number | string;
    }
  ) {}

  return(confirm: boolean) {
    this.matDialogRef.close(confirm);
  }
}
