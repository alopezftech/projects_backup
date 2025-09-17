import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-upload-python-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './upload-python-dialog.component.html',
  styleUrls: ['./upload-python-dialog.component.scss']
})
export class UploadPythonDialogComponent {
  pythonFile?: File;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<UploadPythonDialogComponent>,
    private taskService: TaskService,
    private loadingService: LoadingService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.pythonFile = input.files[0];
    } else {
      this.pythonFile = undefined;
    }
  }

  async upload() {
    if (!this.pythonFile) return;
    const filename = this.pythonFile.name;
    this.loadingService.setLoading(true);
    try {
      const exists = await this.taskService.checkScriptExists(filename).toPromise();
      if (exists && exists.exists) {
        if (!window.confirm(`Ya existe un archivo llamado ${filename}. ¿Deseas sobreescribirlo?`)) return;
      }
      this.loading = true;
      const formData = new FormData();
      formData.append('scriptFile', this.pythonFile);
      this.taskService.overwritePythonFile(formData).subscribe({
        next: () => {
          window.alert('Archivo subido correctamente.');
          this.dialogRef.close(true);
          this.loadingService.setLoading(false);
        },
        error: err => {
          window.alert(err.error?.error || 'Error subiendo el archivo');
          this.loading = false;
          this.loadingService.setLoading(false);
        }
      });
    } catch (e) {
      this.loadingService.setLoading(false);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
