import { Component } from '@angular/core';
import { EnvService } from '../../services/env.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-env-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './env-editor.component.html',
  styleUrls: ['./env-editor.component.scss']
})
export class EnvEditorComponent {
  envContent = '';
  envContentTest = '';
  loading = true;
  loadingTest = true;
  saving = false;
  savingTest = false;
  restoring = false;

  constructor(
    private envService: EnvService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loadEnv();
    this.loadEnvTest();
  }

  loadEnv() {
    this.loading = true;
    this.loadingService.setLoading(true);
    this.envService.getEnv().subscribe({
      next: content => {
        this.envContent = content;
        this.loading = false;
        this.loadingService.setLoading(false);
      },
      error: _ => {
        this.toastService.show('No se pudo cargar el archivo .env-scripts', 'error');
        this.loading = false;
        this.loadingService.setLoading(false);
      }
    });
  }

  saveEnv() {
    this.saving = true;
    this.loadingService.setLoading(true);
    this.envService.saveEnv(this.envContent).subscribe({
      next: () => {
        this.toastService.show('Guardado correctamente', 'success');
        this.saving = false;
        this.loadingService.setLoading(false);
      },
      error: _ => {
        this.toastService.show('Error al guardar el archivo', 'error');
        this.saving = false;
        this.loadingService.setLoading(false);
      }
    });
  }

  loadEnvTest() {
    this.loadingTest = true;
    this.loadingService.setLoading(true);
    this.envService.getEnvTest().subscribe({
      next: content => {
        this.envContentTest = content;
        this.loadingTest = false;
        this.loadingService.setLoading(false);
      },
      error: _ => {
        this.toastService.show('No se pudo cargar el archivo .env-scripts-test', 'error');
        this.loadingTest = false;
        this.loadingService.setLoading(false);
      }
    });
  }

  saveEnvTest() {
    this.savingTest = true;
    this.loadingService.setLoading(true);
    this.envService.saveEnvTest(this.envContentTest).subscribe({
      next: () => {
        this.toastService.show('Guardado correctamente', 'success');
        this.savingTest = false;
        this.loadingService.setLoading(false);
      },
      error: _ => {
        this.toastService.show('Error al guardar el archivo', 'error');
        this.savingTest = false;
        this.loadingService.setLoading(false);
      }
    });
  }

  restoreEnvBackup() {
    this.restoring = true;
    this.loadingService.setLoading(true);
    this.envService.restoreEnvBackup().subscribe({
      next: () => {
        this.toastService.show('Backup restaurado correctamente', 'success');
        this.loadEnv();
        this.restoring = false;
        this.loadingService.setLoading(false);
      },
      error: _ => {
        this.toastService.show('Error al restaurar el backup', 'error');
        this.restoring = false;
        this.loadingService.setLoading(false);
      }
    });
  }
}
