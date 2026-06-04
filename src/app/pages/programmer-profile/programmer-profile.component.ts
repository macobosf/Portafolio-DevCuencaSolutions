import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PROGRAMADORES, PROJECTS } from '../../core/mock-data';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-programmer-profile',
  imports: [RouterLink, ProjectCardComponent, FadeInDirective, LoadingSpinnerComponent],
  templateUrl: './programmer-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgrammerProfileComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly programmer = toSignal(
    this.route.params.pipe(
      map(params => PROGRAMADORES.find(p => p.slug === params['slug']) ?? null),
    ),
  );

  protected readonly projects = computed(() => {
    const dev = this.programmer();
    if (!dev) return [];
    return PROJECTS.filter(p => p.programadorIds.includes(dev.id));
  });
}
