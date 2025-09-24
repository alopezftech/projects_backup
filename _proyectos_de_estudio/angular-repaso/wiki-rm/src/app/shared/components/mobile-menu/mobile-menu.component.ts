import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Menú móvil standalone para navegación principal
 * Utiliza directivas Angular 20 (@if)
 */
@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent {
  @Input() links: Array<{ path: string; label: string; description: string }> = [];
  @Input() open = false;
  @Output() closeMenu = new EventEmitter<void>();

  onCloseMenu() {
    this.closeMenu.emit();
  }
}
