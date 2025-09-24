import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private apiUrl = 'https://rickandmortyapi.com/api/episode';

  constructor(private http: HttpClient) {}

  getTotalEpisodes(): Observable<number> {
    return this.http.get<{ info: { count: number } }>(this.apiUrl)
      .pipe(map(response => response.info.count));
  }
}
