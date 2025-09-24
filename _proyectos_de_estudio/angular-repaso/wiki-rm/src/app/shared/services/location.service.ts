import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private apiUrl = 'https://rickandmortyapi.com/api/location';

  constructor(private http: HttpClient) {}

  getTotalLocations(): Observable<number> {
    return this.http.get<{ info: { count: number } }>(this.apiUrl)
      .pipe(map(response => response.info.count));
  }
}
