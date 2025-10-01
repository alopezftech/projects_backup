import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})


export class Header {
  showDropdown = false;
  showFilters = false;
  
  @Output() filtersToggle = new EventEmitter<void>();

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    this.filtersToggle.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.showDropdown = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.showDropdown = false;
  }
}
