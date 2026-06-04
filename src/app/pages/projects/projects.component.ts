import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { PROJECTS } from '../../core/mock-data';
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
  protected readonly filterOptions: { value: FilterType; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'laboral', label: 'Laboral' },
    { value: 'personal', label: 'Personal' },
    { value: 'academico', label: 'Académico' },
    { value: 'simulado', label: 'Simulado' },
  ];

  protected readonly activeFilter = signal<FilterType>('todos');

  protected readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'todos' ? PROJECTS : PROJECTS.filter((p) => p.tipo === filter);
  });

  protected setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }
}
