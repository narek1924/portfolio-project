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
  currentList!: string;
  currentPriority!: priorityStatus;
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
        this.currentList = this.info.current as string;
      }
    } else {
      this.priorities = [...(this.info.data as priorityStatus[])];
      if (this.info.current) {
        this.currentPriority = this.info.current as priorityStatus;
      }
    }
  }
  returnData(type: string, data: string | priorityStatus) {
    if (data === this.currentList || data === this.currentPriority) {
      return;
    }
    this.matDialogRef.close({ type: type, data: data });
  }
}
