import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppService } from '../../services/app.service';
import { FiltersService } from '../../services/filters.service';
import { AuditFilters } from '../../interfaces/image.interface';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarMenu {
  @Output() filtersApplied = new EventEmitter<AuditFilters>();

  isLoading = false;
  isMobileMenuOpen = false;

  // TODO : Evaluar un método automático de carga
  // Filter data
  faculties: string[] = [
    'Medicina',
    'Escuela de negocios',
    'Enfermeria',
    'Educacion',
    'Ingenieria',
    'Informatica',
    'Psicologia',
    'Derecho',
    'Veterinaria',
    'Humanidades',
    'Periodismo y Comunicacion',
    'Fisioterapia',
    'Diseno',
    'Farmacia',
    'Ciencias del deporte',
    'Videojuegos',
    'Escuela de idiomas',
    'Nutricion',
    'Odontologia',
    'Inteligencia Artificial',
  ];

  studyTypes: string[] = [
    'Curso',
    'Experto',
    'Master',
    'Capacitacion Practica',
    'Master Semipresencial',
    'Grand master',
    'Master-universitario',
    'Grand Master Oficial Universitario',
    'Master Oficial Universitario',
    'Programa de Desarrollo Directivo',
    'Clases en directo individuales',
    'Clases en directo',
    'Curso-idiomas',
    'Examen',
    'Grado',
    'Grado Oficial Universitario',
    'Doctorado',
  ];

  // Autocomplete states
  showFacultyOptions = false;
  showStudyTypeOptions = false;
  filteredFaculties: string[] = [];
  filteredStudyTypes: string[] = [];

  // Selected filters
  selectedFaculty = '';
  selectedStudyType = '';

  constructor(private filtersService: FiltersService) {
    this.initializeFilters();
  }

  initializeFilters() {
    this.filteredFaculties = [...this.faculties];
    this.filteredStudyTypes = [...this.studyTypes];
  }

  // Mobile menu functions
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.toggleBodyScroll();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.toggleBodyScroll();
  }

  private toggleBodyScroll(): void {
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    // Cerrar menú mobile al cambiar a desktop
    if (target.innerWidth >= 900) {
      this.closeMobileMenu();
    }
  }

  filterFaculties(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase();

    if (term === '') {
      this.filteredFaculties = [...this.faculties];
    } else {
      this.filteredFaculties = this.faculties.filter((faculty) =>
        faculty.toLowerCase().includes(term)
      );
    }
    this.showFacultyOptions = true;
  }

  filterStudyTypes(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase();

    if (term === '') {
      this.filteredStudyTypes = [...this.studyTypes];
    } else {
      this.filteredStudyTypes = this.studyTypes.filter((type) =>
        type.toLowerCase().includes(term)
      );
    }
    this.showStudyTypeOptions = true;
  }

  selectFaculty(faculty: string) {
    this.selectedFaculty = faculty;
    this.showFacultyOptions = false;
    this.filteredFaculties = [...this.faculties];
  }

  selectStudyType(type: string) {
    this.selectedStudyType = type;
    this.showStudyTypeOptions = false;
    this.filteredStudyTypes = [...this.studyTypes];
  }

  hideFacultyOptions() {
    setTimeout(() => {
      this.showFacultyOptions = false;
    }, 200);
  }

  hideStudyTypeOptions() {
    setTimeout(() => {
      this.showStudyTypeOptions = false;
    }, 200);
  }

  applyFilters() {
    console.log('🔍 Applying filters from sidebar:', {
      faculty: this.selectedFaculty,
      studyType: this.selectedStudyType,
    });

    this.isLoading = true;

    // Create filters object
    const filters: AuditFilters = {
      faculty: this.selectedFaculty,
      studyType: this.selectedStudyType,
    };

    // Update filters in service and trigger manual search
    this.filtersService.updateFilters(filters);
    this.filtersService.executeManualSearch(filters);

    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  // Apply filters and close mobile menu
  applyFiltersAndClose() {
    this.applyFilters();
    // Close mobile menu after applying filters
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  clearFilters() {
    this.selectedFaculty = '';
    this.selectedStudyType = '';
    this.initializeFilters();

    // Create empty filters
    const emptyFilters: AuditFilters = {
      faculty: '',
      studyType: '',
    };

    // Only update the filters service, do NOT emit search event
    // The "Clear" button should not execute searches, only clear the fields
    this.filtersService.updateFilters(emptyFilters);
  }

  clearFaculty() {
    this.selectedFaculty = '';
    this.filteredFaculties = [...this.faculties];
    
    // Update filters
    const filters: AuditFilters = {
      faculty: '',
      studyType: this.selectedStudyType,
    };
    this.filtersService.updateFilters(filters);
  }

  clearStudyType() {
    this.selectedStudyType = '';
    this.filteredStudyTypes = [...this.studyTypes];
    
    // Update filters
    const filters: AuditFilters = {
      faculty: this.selectedFaculty,
      studyType: '',
    };
    this.filtersService.updateFilters(filters);
  }
}
