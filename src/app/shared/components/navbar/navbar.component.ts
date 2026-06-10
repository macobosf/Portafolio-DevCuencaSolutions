/**
 * @description Barra de navegación principal de la aplicación.
 * Gestiona el menú, links activos y el flujo de cierre de sesión con confirmación.
 */
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  // OnPush: el componente solo se re-renderiza cuando cambian sus inputs o se emite un signal/event,
  // reduciendo el número de ciclos de detección de cambios en toda la app.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  // inject() en lugar del constructor mantiene la clase más plana y permite
  // usar las dependencias directamente como propiedades de clase sin boilerplate.
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * @description Ejecuta el cierre de sesión y redirige al home.
   * Redirigir a '/' garantiza que el usuario no quede en una ruta protegida
   * tras destruir su sesión (evita flash de contenido o errores de guard).
   */
  protected async logout(): Promise<void> {
    await this.auth.logout();
    // Redirige al inicio para evitar que el usuario quede en una ruta protegida
    this.router.navigate(['/']);
  }

  /**
   * @description Muestra un diálogo de confirmación nativo antes de cerrar sesión.
   * Previene cierres accidentales al requerir una acción explícita del usuario.
   */
  protected async confirmLogout(): Promise<void> {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      await this.logout();
    }
  }
}
