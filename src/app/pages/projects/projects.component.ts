import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { StrapiService } from '../../core/strapi.service';
import { Project } from '../../core/mock-data';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

type FilterType = 'todos' | 'academico' | 'personal' | 'laboral' | 'simulado';

@Component({
  selector: 'app-projects',
  imports: [ProjectCardComponent, FadeInDirective],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private readonly strapi = inject(StrapiService);

  protected readonly filterOptions: { value: FilterType; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'laboral', label: 'Laboral' },
    { value: 'personal', label: 'Personal' },
    { value: 'academico', label: 'Académico' },
    { value: 'simulado', label: 'Simulado' },
  ];

  protected readonly activeFilter = signal<FilterType>('todos');

  private readonly allProjects = toSignal(
    this.strapi.getProyectos().pipe(catchError(() => of<Project[]>([])))
  );

  protected readonly isLoading = computed(() => this.allProjects() === undefined);

  protected readonly filteredProjects = computed(() => {
    const all = this.allProjects() ?? [];
    const filter = this.activeFilter();
    return filter === 'todos' ? all : all.filter((p) => p.tipo === filter);
  });

  protected setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }
}
