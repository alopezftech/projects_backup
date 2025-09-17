import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskService } from '../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatLabel, MatFormField, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {
  scheduledTime = '';
  taskName = '';
  existingScripts: string[] = [];
  selectedScript: string = '';
  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    private taskService: TaskService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.taskService.getExistingScripts().subscribe({
      next: scripts => {
        this.existingScripts = scripts;
        this.loadingService.setLoading(false);
      },
      error: _ => {
        this.loadingService.setLoading(false);
      }
    });
  }

  async create() {
    if (!this.taskName || !this.selectedScript || !this.scheduledTime) return;
    this.loadingService.setLoading(true);
    try {
      // Validar nombre único
      const tasks = await this.taskService.getTasks().toPromise();
      if (tasks && tasks.some(t => t.Name === this.taskName)) {
        window.alert('Ya existe una tarea con ese nombre.');
        return;
      }
      // Enviar como objeto plano para JSON
      this.dialogRef.close({
        Name: this.taskName,
        ScriptName: this.selectedScript,
        ScheduledTime: this.scheduledTime,
        overwrite: false
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }
  cancel() {
    this.dialogRef.close();
  }
}
