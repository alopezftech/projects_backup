import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-time-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatLabel, MatFormField, MatInputModule, MatButtonModule],
  templateUrl: './time-edit-dialog.component.html',
  styleUrls: ['./time-edit-dialog.component.scss']
})
export class TimeEditDialogComponent {
  time: string;
  constructor(
    public dialogRef: MatDialogRef<TimeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { time: string }
  ) {
    this.time = data.time;
  }

  save() {
    this.dialogRef.close(this.time);
  }
}
