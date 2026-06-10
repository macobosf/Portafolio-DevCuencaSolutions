/**
 * @description Configuración raíz de la aplicación Angular.
 * Registra todos los providers necesarios para que la app funcione correctamente,
 * siguiendo el patrón standalone de Angular 17+ (sin NgModules).
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Captura errores globales no manejados en el navegador y los reporta a Angular
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,
      // withComponentInputBinding: permite que los parámetros de ruta (:slug) se
      // pasen directamente como @Input() al componente sin necesidad de ActivatedRoute
      withComponentInputBinding(),
      // onSameUrlNavigation: 'reload' fuerza la re-ejecución de guards y resolvers
      // al navegar a la misma URL (útil para refrescar datos en la misma página)
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      // scrollPositionRestoration: 'top' hace scroll al inicio al navegar entre páginas,
      // replicando el comportamiento esperado en un MPA para una mejor UX
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),

    // provideHttpClient habilita el sistema de HttpClient en toda la app para las
    // llamadas REST a Strapi; requerido por StrapiService
    provideHttpClient(),

    // ─── Firebase providers ────────────────────────────────────────────────
    // provideFirebaseApp inicializa la conexión con Firebase usando las credenciales
    // del entorno; debe declararse antes de provideAuth y provideFirestore
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // provideAuth registra Firebase Authentication como servicio inyectable (Auth)
    provideAuth(() => getAuth()),

    // provideFirestore registra Firestore como servicio inyectable (Firestore)
    provideFirestore(() => getFirestore()),
  ],
};
