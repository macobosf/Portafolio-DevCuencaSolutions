/**
 * @description Página principal de la aplicación. Muestra programadores, servicios
 * y proyectos destacados cargados desde Strapi, más un efecto typewriter animado.
 */
import { Component, ChangeDetectionStrategy, signal, afterNextRender, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { StrapiService } from '../../core/strapi.service';
import { SeoService } from '../../core/seo.service';
import { Programmer, Project, Service } from '../../core/mock-data';
import { ProgrammerCardComponent } from '../../shared/components/programmer-card/programmer-card.component';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { PageTransitionDirective } from '../../shared/directives/page-transition.directive';
import { CountUpDirective } from '../../shared/directives/count-up.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProgrammerCardComponent, ServiceCardComponent, ProjectCardComponent, SkeletonComponent, FadeInDirective, PageTransitionDirective, CountUpDirective],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly strapi = inject(StrapiService);
  private readonly seo = inject(SeoService);

  // ─── Datos remotos como signals ───────────────────────────────────────────
  // toSignal() convierte un Observable en un Signal de Angular, integrándose
  // nativamente con OnPush sin necesidad de async pipe ni suscripciones manuales.
  // catchError devuelve un array vacío para que la UI degrade gracefully si la API falla.
  protected readonly programmers = toSignal(
    this.strapi.getProgramadores().pipe(catchError(() => of<Programmer[]>([])))
  );
  protected readonly services = toSignal(
    this.strapi.getServicios().pipe(catchError(() => of<Service[]>([])))
  );

  // Se cargan solo los proyectos destacados en el home para mantener la página ligera
  protected readonly featuredProjects = toSignal(
    this.strapi.getProyectosDestacados().pipe(catchError(() => of<Project[]>([])))
  );

  // ─── Estado de carga global ────────────────────────────────────────────────
  // isLoading es true mientras CUALQUIERA de los tres signals sea undefined
  // (undefined = Observable aún no ha emitido su primer valor).
  // Cuando los tres tengan datos, la UI reemplaza los skeletons por el contenido real.
  protected readonly isLoading = computed(
    () =>
      this.programmers() === undefined ||
      this.services() === undefined ||
      this.featuredProjects() === undefined
  );

  // Signal mutable que el typewriter actualiza carácter a carácter
  protected readonly typewriterText = signal('');

  private readonly phrases = [
    'Especialistas en Redes Mikrotik',
    'Desarrollo Web con Angular y Java',
    'Soluciones IT Integrales',
  ];

  constructor() {
    // Se actualiza el SEO en el constructor para que los meta tags estén disponibles
    // antes del primer render (importante para crawlers de motores de búsqueda).
    this.seo.updateSeo({
      title: 'Inicio',
      description: 'DevCuenca Solutions - Redes Mikrotik/Cisco, desarrollo web con Angular y sistemas Java. Soluciones tecnológicas profesionales en Cuenca, Ecuador.',
      keywords: 'desarrollo web, Angular, Mikrotik, Cisco, Java, Cuenca, Ecuador',
      url: 'https://portafolio-54995.web.app',
    });
    // afterNextRender garantiza que el DOM esté disponible antes de iniciar la animación,
    // evitando errores de SSR y asegurando que el efecto sea visible para el usuario.
    afterNextRender(() => this.runTypewriter());
  }

  /**
   * @description Ejecuta el efecto typewriter cíclico sobre las frases definidas.
   * Alterna entre escribir y borrar cada frase usando setTimeout recursivo
   * para controlar los tiempos de escritura, pausa y borrado independientemente.
   */
  private runTypewriter(): void {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const phrase = this.phrases[phraseIndex];
      if (deleting) {
        this.typewriterText.set(phrase.slice(0, --charIndex));
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % this.phrases.length;
          // Pausa antes de empezar a escribir la siguiente frase
          setTimeout(tick, 400);
          return;
        }
      } else {
        this.typewriterText.set(phrase.slice(0, ++charIndex));
        if (charIndex === phrase.length) {
          deleting = true;
          // Pausa al terminar de escribir la frase completa antes de borrar
          setTimeout(tick, 1800);
          return;
        }
      }
      // Velocidad de borrado (40ms) más rápida que la de escritura (70ms) para UX natural
      setTimeout(tick, deleting ? 40 : 70);
    };

    tick();
  }
}
