/**
 * @description Formulario para que usuarios externos envíen una solicitud de contacto
 * a un programador de la plataforma. Solo accesible para usuarios autenticados no-programadores.
 */
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { PageTransitionDirective } from '../../shared/directives/page-transition.directive';
import { FirestoreService } from '../../core/firestore.service';
import { PROGRAMADORES } from '../../core/mock-data';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-contact-request',
  imports: [ReactiveFormsModule, RouterLink, PageTransitionDirective],
  templateUrl: './contact-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRequestComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  constructor() {
    // Redirección defensiva: si un programador accede a esta ruta (ej: URL directa),
    // se le redirige a su dashboard. Complementa al guard de ruta para evitar UX confusa.
    if (this.auth.isProgrammer()) {
      this.router.navigate(['/dashboard/programador']);
      return;
    }
  }

  // FirestoreService se inyecta después del constructor para que la redirección ocurra primero
  private readonly firestoreService = inject(FirestoreService);

  // Lista de programadores disponibles para seleccionar en el formulario
  protected readonly programadores = PROGRAMADORES;

  // ─── Signals de estado del formulario ─────────────────────────────────────
  // submitted: controla si se muestra el modal de éxito tras enviar
  protected readonly submitted = signal(false);
  // submitting: deshabilita el botón de envío mientras la operación async está en curso
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  // ─── Definición del formulario reactivo ───────────────────────────────────
  // Los campos se pre-llenan con los datos del usuario autenticado para mejorar la UX
  protected readonly form = this.fb.group({
    nombre: [
      this.auth.getUserName(),
      [Validators.required, Validators.minLength(3)],
    ],
    correo: [
      // Email del usuario logueado como valor inicial; editable por si usa otro correo
      this.auth.currentUser()?.email ?? '',
      [Validators.required, Validators.email],
    ],
    // Se selecciona el primer programador por defecto para facilitar el flujo
    programadorId: [PROGRAMADORES[0]?.id ?? '1', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
  });

  /**
   * @description Construye el objeto solicitud con todos los campos necesarios y lo persiste en Firestore.
   * El campo 'programadorEmail' se resuelve localmente desde el array PROGRAMADORES
   * para evitar una consulta adicional a la API.
   */
  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      const uid = this.auth.currentUser()!.uid;
      const programadorId = this.form.value.programadorId!;
      // Se busca el email del programador seleccionado sin llamada adicional a la API
      const programador = this.programadores.find(
        (p) => p.id === programadorId,
      );
      await this.firestoreService.crearSolicitud({
        uid,
        nombreSolicitante: this.form.value.nombre!,
        correo: this.form.value.correo!,
        descripcion: this.form.value.descripcion!,
        programadorId,
        programadorEmail: programador?.email ?? '',
        // Fecha en formato ISO 'YYYY-MM-DD' para facilitar ordering en Firestore
        fechaCreacion: new Date().toISOString().substring(0, 10),
        estado: 'Pendiente',
        observacion: '',
      });
      this.submitted.set(true);
      this.toast.show('¡Solicitud enviada exitosamente!', 'success');
      // Se abre el modal de éxito nativo del navegador para confirmar el envío al usuario
      const modal = document.getElementById('success_modal') as HTMLDialogElement;
      modal?.showModal();
    } catch {
      this.errorMessage.set('Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      this.submitting.set(false);
    }
  }

  /**
   * @description Resetea el formulario a su estado inicial conservando los datos del usuario.
   * Permite enviar una nueva solicitud sin recargar la página.
   */
  protected reset(): void {
    this.form.reset({
      nombre: this.auth.getUserName(),
      correo: this.auth.currentUser()?.email ?? '',
      programadorId: PROGRAMADORES[0]?.id ?? '1',
    });
    this.submitted.set(false);
    this.errorMessage.set(null);
  }
}
