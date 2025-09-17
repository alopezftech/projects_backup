import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:3001/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.apiUrl);
  }

  updateTaskTime(id: number, ScheduledTime: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { ScheduledTime });
  }

  // Cambia el método para aceptar Name y enviar JSON correctamente
  createTask(Name: string, ScriptName: string, ScheduledTime: string): Observable<any> {
    return this.http.post(this.apiUrl, { Name, ScriptName, ScheduledTime });
  }

  updateTaskActive(id: number, Active: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/active`, { Active });
  }

  createTaskWithFile(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  overwritePythonFile(formData: FormData): Observable<any> {
    // Cambia la URL al nuevo endpoint unificado
    return this.http.post('http://localhost:3001/api/scripts/upload', formData);
  }

  checkScriptExists(filename: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`http://localhost:3001/api/scripts/exists/${filename}`);
  }

  getExistingScripts(): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:3001/api/scripts`);
  }

  updateTaskName(id: number, Name: string) {
    return this.http.put(`http://localhost:3001/api/tasks/${id}/name`, { Name });
  }

  updateTaskEntorno(id: number, Entorno: 'Test' | 'Prod'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/entorno`, { Entorno });
  }
}
