/**
 * @description Página de perfil de un programador individual.
 * Carga dinámicamente el programador y sus proyectos a partir del slug en la URL,
 * reaccionando a cambios de ruta sin necesidad de recrear el componente.
 */
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
  // ActivatedRoute provee acceso reactivo a los parámetros de la URL actual
  private readonly route = inject(ActivatedRoute);
  private readonly strapi = inject(StrapiService);
  private readonly seo = inject(SeoService);

  /**
   * Observable del programador derivado del parámetro :slug de la URL.
   *
   * switchMap cancela la petición HTTP anterior si el slug cambia antes de que
   * ésta complete (ej: el usuario navega rápidamente entre perfiles), evitando
   * condiciones de carrera y resultados desactualizados en la UI.
   *
   * shareReplay(1) evita una segunda llamada HTTP cuando projects$ se suscribe al mismo observable:
   * ambos (programmer$ y projectsRaw) comparten el mismo resultado cacheado.
   */
  private readonly programmer$ = this.route.params.pipe(
    map((params) => params['slug'] as string),
    switchMap((slug) =>
      this.strapi.getProgramadorBySlug(slug).pipe(catchError(() => of<Programmer | null>(null)))
    ),
    shareReplay(1)
  );

  // undefined = cargando | null = no encontrado | Programmer = encontrado
  protected readonly programmer = toSignal<Programmer | null>(this.programmer$);

  /**
   * Los proyectos dependen del programador: primero se carga el programador para obtener
   * su ID de Strapi, luego se hace una segunda llamada filtrando por ese ID.
   * switchMap cancela la petición de proyectos si llega un nuevo programador antes de que complete.
   */
  // Usa el id numérico de Strapi (ej: "2") para filtrar por relación
  private readonly projectsRaw = toSignal<Project[]>(
    this.programmer$.pipe(
      switchMap((dev) => {
        // Si no hay programador (404 o error), devuelve lista vacía sin llamada HTTP
        if (!dev) return of<Project[]>([]);
        return this.strapi
          .getProyectosByProgramador(dev.id)
          .pipe(catchError(() => of<Project[]>([])));
      })
    )
  );

  // Normaliza undefined (estado inicial de toSignal) a array vacío para evitar errores en el template
  protected readonly projects = computed(() => this.projectsRaw() ?? []);

  constructor() {
    // effect() reacciona cada vez que el signal `programmer` cambia y actualiza los meta tags
    // de SEO con los datos reales del programador, optimizando el indexado por buscadores.
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
