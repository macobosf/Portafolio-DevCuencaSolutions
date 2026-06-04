import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROGRAMADORES, PROJECTS, Project } from '../../core/mock-data';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './project-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly project = signal<Project | null | undefined>(undefined);
  protected readonly programadorNombre = signal<string>('');

  protected getProjectStyle(tecnologias: string[]): { color: string; icon: string } {
    const techs = tecnologias.map(t => t.toLowerCase());
    if (techs.some(t => t.includes('angular'))) return { color: '#dc2626', icon: 'angular' };
    if (techs.some(t => t.includes('react'))) return { color: '#0ea5e9', icon: 'react' };
    if (techs.some(t => t.includes('java') || t.includes('spring') || t.includes('jakarta'))) return { color: '#f97316', icon: 'java' };
    if (techs.some(t => t.includes('node'))) return { color: '#16a34a', icon: 'node' };
    if (techs.some(t => ['mikrotik', 'cisco', 'vpn', 'vlan', 'ospf', 'bgp', 'firewall'].some(k => t.includes(k)))) return { color: '#1d4ed8', icon: 'network' };
    if (techs.some(t => t.includes('python'))) return { color: '#eab308', icon: 'python' };
    if (techs.some(t => ['javascript', 'html', 'css'].some(k => t.includes(k)))) return { color: '#7c3aed', icon: 'code' };
    return { color: '#475569', icon: 'code' };
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const found = PROJECTS.find((p) => p.slug === slug);
    this.project.set(found ?? null);
    if (found) {
      const prog = PROGRAMADORES.find((d) => found.programadorIds.includes(d.id));
      this.programadorNombre.set(prog?.nombre ?? '');
    }
  }
}
