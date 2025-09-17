import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pacman-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pacman-loader.component.html',
  styleUrls: ['./pacman-loader.component.scss']
})
export class PacmanLoaderComponent {
  loading$: Observable<boolean>;
  constructor(public loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
