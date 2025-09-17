import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnvService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3001/api/env-scripts';
  private apiUrlTest = 'http://localhost:3001/api/env-scripts-test';

  getEnv(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }

  saveEnv(content: string): Observable<string> {
    return this.http.post(this.apiUrl, { content }, { responseType: 'text' });
  }

  getEnvTest(): Observable<string> {
    return this.http.get(this.apiUrlTest, { responseType: 'text' });
  }

  saveEnvTest(content: string): Observable<string> {
    return this.http.post(this.apiUrlTest, { content }, { responseType: 'text' });
  }

  restoreEnvBackup(): Observable<string> {
    return this.http.post(this.apiUrl + '/restore-backup', {}, { responseType: 'text' });
  }
}
