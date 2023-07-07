import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-list-modal',
  templateUrl: './create-list-modal.component.html',
  styleUrls: ['./create-list-modal.component.scss'],
})
export class CreateListModalComponent implements OnInit {
  input!: string;
  constructor(
    private matDialogRef: MatDialogRef<CreateListModalComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public info: {
      data: string;
    }
  ) {}
  ngOnInit(): void {
    if (this.info) {
      this.input = this.info.data;
    }
  }
  close() {
    this.matDialogRef.close();
  }
  submit() {
    if (this.input.trim()) {
      this.matDialogRef.close(this.input.trim());
    }
  }
}
