import { Component, signal, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/Header/header';
import { SidebarMenu } from './components/SidebarMenu/sidebar';
import { FiltersService } from './services/filters.service';
import { AuditFilters } from './interfaces/image.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, SidebarMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('ImagenesApp');
  @ViewChild(SidebarMenu) sidebar!: SidebarMenu;

  activeFilters: AuditFilters = { faculty: '', studyType: '' };

  constructor(private filtersService: FiltersService) {}

  ngAfterViewInit() {
    console.log('App component initialized');
  }

  onFiltersApplied(filters: AuditFilters) {
    console.log('🔍 Filters received in App:', filters);
    this.activeFilters = filters;
    
    // Use the service to communicate filters and execute manual search
    this.filtersService.updateFilters(filters);
    this.filtersService.executeManualSearch(filters);
  }

  toggleSidebarFilters() {
    if (this.sidebar) {
      this.sidebar.toggleMobileMenu();
    }
  }
}
