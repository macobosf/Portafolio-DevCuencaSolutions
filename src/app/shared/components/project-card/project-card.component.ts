import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/mock-data';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink],
  templateUrl: './project-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();

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
}
