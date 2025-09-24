import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { EpisodeService } from '../../../shared/services/episode.service';
import { LocationService } from '../../../shared/services/location.service';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  
readonly totalCharacters$;
  readonly totalEpisodes$;
  readonly totalLocations$;

  constructor(
    private characterService: CharacterService,
    private episodeService: EpisodeService,
    private locationService: LocationService
  ) {
    this.totalCharacters$ = this.characterService.getTotalCharacters();
    this.totalEpisodes$ = this.episodeService.getTotalEpisodes();
    this.totalLocations$ = this.locationService.getTotalLocations();
  }
}
