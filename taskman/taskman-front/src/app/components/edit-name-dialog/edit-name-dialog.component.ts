import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-name-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatLabel, MatFormField, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Editar nombre de la tarea</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Nuevo nombre</mat-label>
        <input matInput [(ngModel)]="data.name" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!data.name">Guardar</button>
    </div>
  `
})
export class EditNameDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  save() {
    this.dialogRef.close(this.data.name);
  }
  cancel() {
    this.dialogRef.close();
  }
}
