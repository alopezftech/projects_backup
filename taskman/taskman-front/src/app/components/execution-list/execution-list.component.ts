import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskModel } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { TimeEditDialogComponent } from '../time-edit-dialog/time-edit-dialog.component';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EditNameDialogComponent } from '../edit-name-dialog/edit-name-dialog.component';
import { PacmanLoaderComponent } from '../pacman-loader/pacman-loader.component';
import { UploadPythonDialogComponent } from '../upload-python-dialog/upload-python-dialog.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-execution-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    LogDialogComponent,
    TimeEditDialogComponent,
    CreateTaskDialogComponent,
    MatTableModule,
    MatSortModule,
    EditNameDialogComponent,
    UploadPythonDialogComponent,
    MatFormFieldModule,
    MatOptionModule,
    MatLabel,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './execution-list.component.html',
  styleUrls: ['./execution-list.component.scss']
})
export class ExecutionListComponent implements OnInit, AfterViewInit {
  tasks: any[] = [];
  @Input() loading = false;
  @Output() loadingChange = new EventEmitter<boolean>();
  displayedColumns = ['Active','Entorno','Name','ScriptName','ScheduledTime','Status','ExecutionTime','Run','Actions'];
  dataSource: any;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  showOverwriteDialog = false;
  overwriteFile?: File;

  filterColumn: string = 'Name';
  filterValue: string = '';
  columnOptions = [
    { value: 'Name', label: 'Nombre' },
    { value: 'ScriptName', label: 'Script' },
    { value: 'ScheduledTime', label: 'Hora programada' },
    { value: 'Status', label: 'Último estado' },
    { value: 'ExecutionTime', label: 'Última ejecución' }
  ];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private http: HttpClient,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // El sort debe asignarse siempre que cambie el dataSource
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  loadData() {
    this.loadingService.setLoading(true);
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks = tasks || [];
        this.dataSource = new MatTableDataSource(this.tasks);
        setTimeout(() => {
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        });
        this.loadingService.setLoading(false);
      },
      error: _ => {
        this.toastService.show('Error al cargar las tareas', 'error');
        this.loadingService.setLoading(false);
      }
    });
  }

  getStatusIcon(status: string) {
    switch (status) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      default: return 'hourglass_empty';
    }
  }

  openLog(log: string) {
    this.dialog.open(LogDialogComponent, {
      data: { log }
    });
  }

  editTime(task: TaskModel) {
    const dialogRef = this.dialog.open(TimeEditDialogComponent, {
      data: { time: task.ScheduledTime }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.setLoading(true);
        this.taskService.updateTaskTime(task.Id, result).subscribe({
          next: () => {
            this.toastService.show('Hora actualizada', 'success');
            this.loadData();
          },
          error: _ => {
            this.toastService.show('Error actualizando la hora', 'error');
            this.loadingService.setLoading(false);
          }
        });
      }
    });
  }

  relaunch(taskId: number) {
    this.loadingService.setLoading(true);
    this.http.post(`http://localhost:3001/api/tasks/${taskId}/execute`, {}).subscribe({
      next: () => {
        this.toastService.show('Tarea ejecutada', 'success');
        this.loadData();
      },
      error: _ => {
        this.toastService.show('Error ejecutando la tarea', 'error');
        this.loadingService.setLoading(false);
      }
    });
  }

  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadingService.setLoading(true);
        if (result.formData) {
          if (result.overwrite) {
            result.formData.append('overwrite', 'true');
          }
          this.taskService.createTaskWithFile(result.formData).subscribe({
            next: () => {
              this.toastService.show('Tarea creada con archivo', 'success');
              this.loadData();
            },
            error: _ => {
              this.toastService.show('Error creando la tarea con archivo', 'error');
              this.loadingService.setLoading(false);
            }
          });
        } else {
          this.taskService.createTask(result.Name, result.ScriptName, result.ScheduledTime).subscribe({
            next: () => {
              this.toastService.show('Tarea creada', 'success');
              this.loadData();
            },
            error: _ => {
              this.toastService.show('Error creando la tarea', 'error');
              this.loadingService.setLoading(false);
            }
          });
        }
      }
    });
  }

  toggleActive(task: any) {
    const newState = task.Active ? 0 : 1;
    const confirmMsg = `¿Estás seguro que deseas cambiar el estado de la tarea a ${newState ? 'Activo' : 'Inactivo'}?`;
    if (confirm(confirmMsg)) {
      this.loadingService.setLoading(true);
      this.taskService.updateTaskActive(task.Id, newState).subscribe({
        next: () => {
          this.toastService.show('Estado de tarea actualizado', 'success');
          this.loadData();
        },
        error: _ => {
          this.toastService.show('Error actualizando el estado de la tarea', 'error');
          this.loadingService.setLoading(false);
        }
      });
    }
  }

  enableEditName(task: any) {
    task.editingName = true;
    task.newName = task.Name;
  }

  cancelEditName(task: any) {
    task.editingName = false;
  }

  saveName(task: any) {
    if (!task.newName || task.newName === task.Name) {
      task.editingName = false;
      return;
    }
    // Validar unicidad en frontend
    if (this.tasks.some(t => t.Id !== task.Id && t.Name === task.newName)) {
      this.toastService.show('Ya existe una tarea con ese nombre.', 'error');
      return;
    }
    this.loadingService.setLoading(true);
    this.taskService.updateTaskName(task.Id, task.newName).subscribe({
      next: () => {
        task.Name = task.newName;
        task.editingName = false;
        this.toastService.show('Nombre actualizado', 'success');
        this.loadingService.setLoading(false);
      },
      error: err => {
        this.toastService.show(err.error?.error || 'Error actualizando el nombre', 'error');
        this.loadingService.setLoading(false);
      }
    });
  }

  openEditNameDialog(task: any) {
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      data: { name: task.Name }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result && result !== task.Name) {
        // Validar unicidad en frontend
        if (this.tasks.some(t => t.Id !== task.Id && t.Name === result)) {
          this.toastService.show('Ya existe una tarea con ese nombre.', 'error');
          return;
        }
        this.loadingService.setLoading(true);
        this.taskService.updateTaskName(task.Id, result).subscribe({
          next: () => {
            task.Name = result;
            this.toastService.show('Nombre actualizado', 'success');
            this.loadingService.setLoading(false);
          },
          error: err => {
            this.toastService.show(err.error?.error || 'Error actualizando el nombre', 'error');
            this.loadingService.setLoading(false);
          }
        });
      }
    });
  }

  setLoading(value: boolean) {
    this.loading = value;
    // Si necesitas emitir un evento, agrégalo aquí
  }

  openOverwriteDialog() {
    this.showOverwriteDialog = true;
    this.overwriteFile = undefined;
  }
  closeOverwriteDialog() {
    this.showOverwriteDialog = false;
    this.overwriteFile = undefined;
  }
  onOverwriteFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.overwriteFile = input.files[0];
    } else {
      this.overwriteFile = undefined;
    }
  }
  async confirmOverwrite() {
    if (!this.overwriteFile) return;
    const filename = this.overwriteFile.name;
    this.loadingService.setLoading(true);
    const exists = await this.taskService.checkScriptExists(filename).toPromise().finally(() => this.loadingService.setLoading(false));
    if (!exists || !exists.exists) {
      this.toastService.show('No existe un archivo .py con ese nombre para sobreescribir.', 'error');
      return;
    }
    if (!window.confirm(`¿Seguro que quieres sobreescribir ${filename}?`)) return;
    const formData = new FormData();
    formData.append('scriptFile', this.overwriteFile);
    this.loadingService.setLoading(true);
    this.taskService.overwritePythonFile(formData).subscribe({
      next: () => {
        this.toastService.show('Archivo sobreescrito correctamente.', 'success');
        this.closeOverwriteDialog();
        this.loadData();
      },
      error: err => {
        this.toastService.show(err.error?.error || 'Error sobreescribiendo el archivo', 'error');
        this.loadingService.setLoading(false);
      }
    });
  }

  openUploadPythonDialog() {
    this.dialog.open(UploadPythonDialogComponent).afterClosed().subscribe(result => {
      if (result) {
        this.toastService.show('Archivo Python subido correctamente', 'success');
        this.loadData();
      }
    });
  }

  applyColumnFilter() {
    if (!this.dataSource) return;
    const col = this.filterColumn;
    const val = this.filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any) => {
      if (!val) return true;
      let cell = data[col];
      if (cell == null) return false;
      cell = String(cell).toLowerCase();
      return cell.includes(val);
    };
    this.dataSource.filter = Math.random().toString(); // fuerza el filtro
  }

  openEnvEditor() {
    window.open('/variables-entorno', '_blank');
  }

  onChangeEntorno(task: any) {
    const nuevo = task.Entorno === 'Prod' ? 'Test' : 'Prod';
    if (confirm(`¿Seguro que quieres cambiar el entorno de esta tarea a '${nuevo}'?`)) {
      this.loadingService.setLoading(true);
      this.taskService.updateTaskEntorno(task.Id, nuevo).subscribe({
        next: () => {
          this.toastService.show('Entorno actualizado', 'success');
          this.loadData();
        },
        error: _ => {
          this.toastService.show('Error actualizando el entorno', 'error');
          this.loadingService.setLoading(false);
        }
      });
    }
  }
}
