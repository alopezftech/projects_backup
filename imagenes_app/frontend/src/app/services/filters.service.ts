import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuditFilters } from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filtersSubject = new BehaviorSubject<AuditFilters>({ faculty: '', studyType: '' });
  public filters$: Observable<AuditFilters> = this.filtersSubject.asObservable();

  // Subject para búsquedas manuales (ej. botón de buscar)
  private manualSearchSubject = new Subject<AuditFilters>();
  public manualSearch$: Observable<AuditFilters> = this.manualSearchSubject.asObservable();

  updateFilters(filters: AuditFilters) {
    console.log('🔄 Updating filters in service:', filters);
    this.filtersSubject.next(filters);
  }

  executeManualSearch(filters: AuditFilters) {
    console.log('🔍 Executing manual search from service:', filters);
    this.manualSearchSubject.next(filters);
  }

  getCurrentFilters(): AuditFilters {
    return this.filtersSubject.value;
  }
}
