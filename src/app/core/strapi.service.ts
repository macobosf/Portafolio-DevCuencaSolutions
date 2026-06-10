/**
 * @description Servicio singleton de acceso a la API REST de Strapi v5.
 * Encapsula todas las llamadas HTTP al CMS headless y mapea las respuestas
 * al modelo de dominio interno de la app.
 *
 * Se usa HttpClient (no fetch nativo) para beneficiarse del sistema de interceptores
 * de Angular (headers globales, manejo de errores centralizado, testing con HttpClientTestingModule).
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Programmer, Project, Service } from './mock-data';

/**
 * @description Genera las iniciales de un nombre para construir el avatar con ui-avatars.
 * Para nombres compuestos (ej: "Marco Antonio Cobos Farfán") salta el segundo
 * nombre y toma el primer apellido (words[2]); si el nombre tiene ≤2 palabras
 * usa words[1] directamente.
 */
function getInitials(nombre: string): string {
  const words = nombre.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  // Para nombres compuestos (ej: "Marco Antonio Cobos Farfán") salta el segundo
  // nombre y toma el primer apellido (words[2]); si el nombre tiene ≤2 palabras
  // usa words[1] directamente.
  const second = (words.length >= 3 ? words[2] : words[1])?.[0] ?? '';
  return (first + second).toUpperCase();
}

/**
 * @description Mapea un objeto raw de Strapi v5 al modelo interno Programmer.
 * Strapi v5 devuelve los atributos aplanados directamente en el objeto (sin la capa
 * `attributes` de v4), por lo que se accede a raw.nombre, raw.correo, etc. directamente.
 * Los valores faltantes se reemplazan con defaults vacíos para evitar errores en la UI.
 */
function mapProgramador(raw: any): Programmer {
  const initials = getInitials(raw.nombre ?? 'Dev');
  return {
    id: String(raw.id),
    nombre: raw.nombre ?? '',
    email: raw.correo ?? '',
    especialidad: raw.especialidad ?? '',
    descripcionBreve: raw.descripcionBreve ?? '',
    descripcion: raw.descripcionCompleta ?? raw.descripcion ?? '',
    // Se genera un avatar dinámico con las iniciales en lugar de almacenar imágenes en Strapi
    foto: `https://ui-avatars.com/api/?name=${initials[0]}+${initials[1]}&background=1d4ed8&color=fff&size=200`,
    github: raw.github ?? '',
    // Strapi puede tener el campo como 'linkiden' (typo histórico) o 'linkedin'
    linkedin: raw.linkiden ?? raw.linkedin ?? '',
    activo: raw.activo ?? false,
    slug: raw.slug ?? '',
    tecnologias: Array.isArray(raw.tecnologias) ? raw.tecnologias : [],
  };
}

/**
 * @description Mapea un objeto raw de Strapi v5 al modelo interno Project.
 * La relación con programadores se resuelve con populate=programadores en la query;
 * sin populate, el campo llega como null o array de IDs según la configuración de Strapi.
 */
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

/**
 * @description Mapea un objeto raw de Strapi v5 al modelo interno Service.
 */
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
  // Base URL de la API de Strapi tomada del entorno (dev vs prod)
  private base = environment.strapiUrl;

  constructor(private http: HttpClient) {}

  /**
   * @description Obtiene todos los programadores activos desde Strapi.
   * map() transforma el array res.data (formato Strapi v5) al modelo interno.
   */
  getProgramadores(): Observable<Programmer[]> {
    return this.http
      .get<any>(`${this.base}/programadors`)
      .pipe(map((res) => (res.data ?? []).map(mapProgramador)));
  }

  /**
   * @description Obtiene un programador por su slug único.
   * filters[slug][$eq] usa la sintaxis de filtros de Strapi v5 (Qs-style).
   * Retorna null si no se encuentra ningún resultado.
   */
  getProgramadorBySlug(slug: string): Observable<Programmer | null> {
    return this.http
      .get<any>(`${this.base}/programadors?filters[slug][$eq]=${slug}`)
      .pipe(map((res) => (res.data?.length ? mapProgramador(res.data[0]) : null)));
  }

  /**
   * @description Obtiene todos los servicios ofrecidos por la agencia.
   */
  getServicios(): Observable<Service[]> {
    return this.http
      .get<any>(`${this.base}/servicios`)
      .pipe(map((res) => (res.data ?? []).map(mapService)));
  }

  /**
   * @description Obtiene todos los proyectos del portafolio sin filtros.
   */
  getProyectos(): Observable<Project[]> {
    return this.http
      .get<any>(`${this.base}/proyectos`)
      .pipe(map((res) => (res.data ?? []).map(mapProject)));
  }

  /**
   * @description Obtiene solo los proyectos marcados como destacados para mostrar en el home.
   * filters[destacado][$eq]=true filtra en el servidor, evitando traer todos los proyectos al cliente.
   */
  getProyectosDestacados(): Observable<Project[]> {
    return this.http
      .get<any>(`${this.base}/proyectos?filters[destacado][$eq]=true`)
      .pipe(map((res) => (res.data ?? []).map(mapProject)));
  }

  /**
   * @description Obtiene un proyecto por su slug.
   * populate=programadores hace que Strapi resuelva la relación y devuelva los
   * objetos completos de programadores en lugar de solo sus IDs, permitiendo el mapeo correcto.
   */
  getProyectoBySlug(slug: string): Observable<Project | null> {
    return this.http
      .get<any>(`${this.base}/proyectos?filters[slug][$eq]=${slug}&populate=programadores`)
      .pipe(map((res) => (res.data?.length ? mapProject(res.data[0]) : null)));
  }

  /**
   * @description Obtiene todos los proyectos asociados a un programador específico.
   * populate=programadores es necesario para que mapProject pueda extraer los IDs
   * de la relación y construir programadorIds correctamente.
   */
  getProyectosByProgramador(programadorId: string): Observable<Project[]> {
    return this.http
      .get<any>(
        `${this.base}/proyectos?filters[programadores][id][$eq]=${programadorId}&populate=programadores`
      )
      .pipe(map((res) => (res.data ?? []).map(mapProject)));
  }
}
