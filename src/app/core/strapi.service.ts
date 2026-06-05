import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Programmer, Project, Service } from './mock-data';

function getInitials(nombre: string): string {
  const words = nombre.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  // Para nombres compuestos (ej: "Marco Antonio Cobos Farfán") salta el segundo
  // nombre y toma el primer apellido (words[2]); si el nombre tiene ≤2 palabras
  // usa words[1] directamente.
  const second = (words.length >= 3 ? words[2] : words[1])?.[0] ?? '';
  return (first + second).toUpperCase();
}

function mapProgramador(raw: any): Programmer {
  const initials = getInitials(raw.nombre ?? 'Dev');
  return {
    id: String(raw.id),
    nombre: raw.nombre ?? '',
    email: raw.correo ?? '',
    especialidad: raw.especialidad ?? '',
    descripcionBreve: raw.descripcionBreve ?? '',
    descripcion: raw.descripcionCompleta ?? raw.descripcion ?? '',
    foto: `https://ui-avatars.com/api/?name=${initials[0]}+${initials[1]}&background=1d4ed8&color=fff&size=200`,
    github: raw.github ?? '',
    linkedin: raw.linkiden ?? raw.linkedin ?? '',
    activo: raw.activo ?? false,
    slug: raw.slug ?? '',
    tecnologias: Array.isArray(raw.tecnologias) ? raw.tecnologias : [],
  };
}

function mapProject(raw: any): Project {
  // Strapi v5 stores the relation as `programadores` (array of objects when populated)
  const programadorIds = Array.isArray(raw.programadores)
    ? raw.programadores.map((p: any) => String(p.id))
    : Array.isArray(raw.programadorIds)
    ? raw.programadorIds.map(String)
    : [];

  return {
    id: String(raw.id),
    nombre: raw.nombre ?? '',
    slug: raw.slug ?? '',
    descripcionBreve: raw.descripcionBreve ?? '',
    descripcionCompleta: raw.descripcionCompleta ?? '',
    tipo: raw.tipo ?? 'personal',
    tecnologias: Array.isArray(raw.tecnologias) ? raw.tecnologias : [],
    repoUrl: raw.repoUrl ?? '',
    demoUrl: raw.demoUrl ?? '',
    destacado: raw.destacado ?? false,
    programadorIds,
  };
}

function mapService(raw: any): Service {
  return {
    id: String(raw.id),
    nombre: raw.nombre ?? '',
    descripcion: raw.descripcion ?? '',
    icono: raw.icono ?? 'code',
  };
}

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private base = environment.strapiUrl;

  constructor(private http: HttpClient) {}

  getProgramadores(): Observable<Programmer[]> {
    return this.http
      .get<any>(`${this.base}/programadors`)
      .pipe(map((res) => (res.data ?? []).map(mapProgramador)));
  }

  getProgramadorBySlug(slug: string): Observable<Programmer | null> {
    return this.http
      .get<any>(`${this.base}/programadors?filters[slug][$eq]=${slug}`)
      .pipe(map((res) => (res.data?.length ? mapProgramador(res.data[0]) : null)));
  }

  getServicios(): Observable<Service[]> {
    return this.http
      .get<any>(`${this.base}/servicios`)
      .pipe(map((res) => (res.data ?? []).map(mapService)));
  }

  getProyectos(): Observable<Project[]> {
    return this.http
      .get<any>(`${this.base}/proyectos`)
      .pipe(map((res) => (res.data ?? []).map(mapProject)));
  }

  getProyectosDestacados(): Observable<Project[]> {
    return this.http
      .get<any>(`${this.base}/proyectos?filters[destacado][$eq]=true`)
      .pipe(map((res) => (res.data ?? []).map(mapProject)));
  }

  getProyectoBySlug(slug: string): Observable<Project | null> {
    return this.http
      .get<any>(`${this.base}/proyectos?filters[slug][$eq]=${slug}&populate=programadores`)
      .pipe(map((res) => (res.data?.length ? mapProject(res.data[0]) : null)));
  }

  getProyectosByProgramador(programadorId: string): Observable<Project[]> {
    return this.http
      .get<any>(
        `${this.base}/proyectos?filters[programadores][id][$eq]=${programadorId}&populate=programadores`
      )
      .pipe(map((res) => (res.data ?? []).map(mapProject)));
  }
}
