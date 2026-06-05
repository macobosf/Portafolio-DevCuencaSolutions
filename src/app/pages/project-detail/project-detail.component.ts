import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of } from 'rxjs';
import { StrapiService } from '../../core/strapi.service';
import { SeoService } from '../../core/seo.service';
import { Project } from '../../core/mock-data';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { PageTransitionDirective } from '../../shared/directives/page-transition.directive';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, SkeletonComponent, PageTransitionDirective],
  templateUrl: './project-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly strapi = inject(StrapiService);
  private readonly seo = inject(SeoService);

  protected readonly project = toSignal<Project | null>(
    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      switchMap((slug) =>
        this.strapi.getProyectoBySlug(slug).pipe(catchError(() => of<Project | null>(null)))
      )
    )
  );

  protected readonly programadorNombre = signal('');

  constructor() {
    effect(() => {
      const proj = this.project();
      if (proj) {
        this.seo.updateSeo({
          title: proj.nombre,
          description: proj.descripcionBreve,
          keywords: proj.tecnologias?.join(', '),
          url: `https://portafolio-54995.web.app/proyectos/${proj.slug}`,
        });
      }
    });
  }

  protected getProjectStyle(tecnologias: string[]): { color: string; icon: string } {
    const techs = tecnologias.map((t) => t.toLowerCase());
    if (techs.some((t) => t.includes('angular'))) return { color: '#dc2626', icon: 'angular' };
    if (techs.some((t) => t.includes('react'))) return { color: '#0ea5e9', icon: 'react' };
    if (techs.some((t) => t.includes('java') || t.includes('spring') || t.includes('jakarta')))
      return { color: '#f97316', icon: 'java' };
    if (techs.some((t) => t.includes('node'))) return { color: '#16a34a', icon: 'node' };
    if (
      techs.some((t) =>
        ['mikrotik', 'cisco', 'vpn', 'vlan', 'ospf', 'bgp', 'firewall'].some((k) => t.includes(k))
      )
    )
      return { color: '#1d4ed8', icon: 'network' };
    if (techs.some((t) => t.includes('python'))) return { color: '#eab308', icon: 'python' };
    if (techs.some((t) => ['javascript', 'html', 'css'].some((k) => t.includes(k))))
      return { color: '#7c3aed', icon: 'code' };
    return { color: '#475569', icon: 'code' };
  }

  protected getTechColor(tech: string): string {
    const t = tech.toLowerCase();
    if (t.includes('angular')) return 'bg-red-100 text-red-700 border border-red-200';
    if (t.includes('typescript')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (t.includes('javascript')) return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    if (t.includes('spring')) return 'bg-green-100 text-green-700 border border-green-200';
    if (t.includes('java')) return 'bg-orange-100 text-orange-700 border border-orange-200';
    if (t.includes('node')) return 'bg-green-100 text-green-700 border border-green-200';
    if (t.includes('react')) return 'bg-cyan-100 text-cyan-700 border border-cyan-200';
    if (t.includes('html')) return 'bg-orange-100 text-orange-700 border border-orange-200';
    if (t.includes('tailwind')) return 'bg-teal-100 text-teal-700 border border-teal-200';
    if (t.includes('css')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (t.includes('firebase')) return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    if (t.includes('postgresql') || t.includes('postgres')) return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    if (t.includes('mysql')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (t.includes('python')) return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
}
