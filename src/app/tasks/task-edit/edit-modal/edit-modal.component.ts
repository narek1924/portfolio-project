import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { priorityStatus } from 'src/app/shared/interfaces/task.interface';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  lists!: string[];
  priorities!: priorityStatus[];
  current!: string | priorityStatus;
  dataToReturn: any = {
    type: 'cancel',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public info: {
      type: string;
      data: string[] | priorityStatus[];
      current?: string | priorityStatus;
    },
    private matDialogRef: MatDialogRef<EditModalComponent>
  ) {}
  ngOnInit(): void {
    if (this.info.type === 'lists') {
      this.lists = [...(this.info.data as string[])];
      if (this.info.current) {
        this.current = this.info.current;
      }
    } else {
      this.priorities = [...(this.info.data as priorityStatus[])];
      if (this.info.current) {
        this.current = this.info.current;
      }
    }
  }
  returnData(type: string, data: string | priorityStatus) {
    if (data === this.current) {
      return;
    }
    this.matDialogRef.close({ type: type, data: data });
  }
}
