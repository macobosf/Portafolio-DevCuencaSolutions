import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { StrapiService } from '../../core/strapi.service';
import { SeoService } from '../../core/seo.service';
import { Project } from '../../core/mock-data';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { PageTransitionDirective } from '../../shared/directives/page-transition.directive';

type FilterType = 'todos' | 'academico' | 'personal' | 'laboral' | 'simulado';

@Component({
  selector: 'app-projects',
  imports: [ProjectCardComponent, SkeletonComponent, FadeInDirective, PageTransitionDirective],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private readonly strapi = inject(StrapiService);
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.updateSeo({
      title: 'Proyectos',
      description: 'Proyectos desarrollados por DevCuenca Solutions: redes, desarrollo web y sistemas.',
      url: 'https://portafolio-54995.web.app/proyectos',
    });
  }

  protected readonly filterOptions: { value: FilterType; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'laboral', label: 'Laboral' },
    { value: 'personal', label: 'Personal' },
    { value: 'academico', label: 'Académico' },
    { value: 'simulado', label: 'Simulado' },
  ];

  protected readonly activeFilter = signal<FilterType>('todos');
  protected readonly techSeleccionada = signal<string | null>(null);

  private readonly allProjects = toSignal(
    this.strapi.getProyectos().pipe(catchError(() => of<Project[]>([])))
  );

  protected readonly isLoading = computed(() => this.allProjects() === undefined);

  protected readonly todasTecnologias = computed(() => {
    const techs = new Set<string>();
    (this.allProjects() ?? []).forEach((p) => p.tecnologias?.forEach((t: string) => techs.add(t)));
    return Array.from(techs).sort();
  });

  protected readonly filteredProjects = computed(() => {
    const all = this.allProjects() ?? [];
    const filter = this.activeFilter();
    const tech = this.techSeleccionada();
    const byTipo = filter === 'todos' ? all : all.filter((p) => p.tipo === filter);
    return tech ? byTipo.filter((p) => p.tecnologias?.includes(tech)) : byTipo;
  });

  protected setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
    this.techSeleccionada.set(null);
  }

  protected setTechFilter(tech: string | null): void {
    this.techSeleccionada.set(tech);
  }
}
