import { Component } from '@angular/core';
import { PacmanLoaderComponent } from './components/pacman-loader/pacman-loader.component';
import { RouterModule } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { ToastService, ToastMessage } from './services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PacmanLoaderComponent, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Taskman';
  loading = false;
  toast: ToastMessage | null = null;
  toastTimeout: any;

  constructor(private loadingService: LoadingService, private toastService: ToastService) {
    this.loadingService.loading$.subscribe(val => this.loading = val);
    this.toastService.toast$.subscribe(msg => {
      this.toast = msg;
      if (msg) {
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => this.toastService.clear(), 3500);
      }
    });
  }
}
