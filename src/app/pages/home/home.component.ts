import { Component, ChangeDetectionStrategy, signal, afterNextRender, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { StrapiService } from '../../core/strapi.service';
import { Programmer, Project, Service } from '../../core/mock-data';
import { ProgrammerCardComponent } from '../../shared/components/programmer-card/programmer-card.component';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProgrammerCardComponent, ServiceCardComponent, ProjectCardComponent, FadeInDirective],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly strapi = inject(StrapiService);

  protected readonly programmers = toSignal(
    this.strapi.getProgramadores().pipe(catchError(() => of<Programmer[]>([])))
  );
  protected readonly services = toSignal(
    this.strapi.getServicios().pipe(catchError(() => of<Service[]>([])))
  );
  protected readonly featuredProjects = toSignal(
    this.strapi.getProyectosDestacados().pipe(catchError(() => of<Project[]>([])))
  );

  protected readonly isLoading = computed(
    () =>
      this.programmers() === undefined ||
      this.services() === undefined ||
      this.featuredProjects() === undefined
  );

  protected readonly typewriterText = signal('');

  private readonly phrases = [
    'Especialistas en Redes Mikrotik',
    'Desarrollo Web con Angular y Java',
    'Soluciones IT Integrales',
  ];

  constructor() {
    afterNextRender(() => this.runTypewriter());
  }

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
          setTimeout(tick, 400);
          return;
        }
      } else {
        this.typewriterText.set(phrase.slice(0, ++charIndex));
        if (charIndex === phrase.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      }
      setTimeout(tick, deleting ? 40 : 70);
    };

    tick();
  }
}
