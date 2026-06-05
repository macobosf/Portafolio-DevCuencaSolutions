import { Component, ChangeDetectionStrategy, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of, shareReplay } from 'rxjs';
import { StrapiService } from '../../core/strapi.service';
import { SeoService } from '../../core/seo.service';
import { Programmer, Project } from '../../core/mock-data';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { PageTransitionDirective } from '../../shared/directives/page-transition.directive';

@Component({
  selector: 'app-programmer-profile',
  imports: [RouterLink, ProjectCardComponent, SkeletonComponent, FadeInDirective, PageTransitionDirective],
  templateUrl: './programmer-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgrammerProfileComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly strapi = inject(StrapiService);
  private readonly seo = inject(SeoService);

  // shareReplay(1) evita una segunda llamada HTTP cuando projects$ se suscribe al mismo observable
  private readonly programmer$ = this.route.params.pipe(
    map((params) => params['slug'] as string),
    switchMap((slug) =>
      this.strapi.getProgramadorBySlug(slug).pipe(catchError(() => of<Programmer | null>(null)))
    ),
    shareReplay(1)
  );

  // undefined = cargando | null = no encontrado | Programmer = encontrado
  protected readonly programmer = toSignal<Programmer | null>(this.programmer$);

  // Usa el id numérico de Strapi (ej: "2") para filtrar por relación
  private readonly projectsRaw = toSignal<Project[]>(
    this.programmer$.pipe(
      switchMap((dev) => {
        if (!dev) return of<Project[]>([]);
        return this.strapi
          .getProyectosByProgramador(dev.id)
          .pipe(catchError(() => of<Project[]>([])));
      })
    )
  );

  protected readonly projects = computed(() => this.projectsRaw() ?? []);

  constructor() {
    effect(() => {
      const dev = this.programmer();
      if (dev) {
        this.seo.updateSeo({
          title: dev.nombre,
          description: dev.descripcionBreve ?? dev.descripcion,
          keywords: dev.especialidad,
          url: `https://portafolio-54995.web.app/programador/${dev.slug}`,
        });
      }
    });
  }
}
