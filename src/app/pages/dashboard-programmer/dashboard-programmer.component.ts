/**
 * @description Dashboard del programador: muestra en tiempo real las solicitudes de contacto
 * recibidas y permite actualizar su estado (Pendiente / Atendida) con observaciones.
 */
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PageTransitionDirective } from '../../shared/directives/page-transition.directive';
import { ToastService } from '../../shared/services/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { FirestoreService } from '../../core/firestore.service';
import { ContactRequest } from '../../core/mock-data';
import { RequestBadgeComponent } from '../../shared/components/request-badge/request-badge.component';

@Component({
  selector: 'app-dashboard-programmer',
  imports: [RouterLink, ReactiveFormsModule, RequestBadgeComponent, PageTransitionDirective],
  templateUrl: './dashboard-programmer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProgrammerComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly firestoreService = inject(FirestoreService);
  private readonly toast = inject(ToastService);

  // Se lee el programadorId una sola vez al iniciar el componente.
  // Este ID es el del documento Firestore del programador (no el UID de Firebase Auth).
  private readonly programadorId = this.auth.programadorId();

  // ─── Escucha en tiempo real de solicitudes ────────────────────────────────
  // obtenerSolicitudesPorProgramador() retorna un Observable de Firestore que emite
  // cada vez que hay un cambio en la colección filtrada por programadorId.
  // toSignal() convierte ese stream en un Signal compatible con OnPush,
  // actualizando la UI automáticamente sin suscripciones manuales.
  // Si no hay programadorId (guard falló), se retorna un observable vacío como fallback seguro.
  protected readonly requests = toSignal(
    this.programadorId
      ? this.firestoreService.obtenerSolicitudesPorProgramador(
          this.programadorId,
        )
      : of([] as ContactRequest[]),
    // initialValue evita que el signal arranque en undefined y rompa el template
    { initialValue: [] as ContactRequest[] },
  );

  // ─── Contadores derivados ──────────────────────────────────────────────────
  // computed() recalcula automáticamente cuando requests() emite nuevos valores
  protected readonly pendingCount = computed(
    () => this.requests().filter((r) => r.estado === 'Pendiente').length,
  );
  protected readonly respondedCount = computed(
    () => this.requests().filter((r) => r.estado === 'Atendida').length,
  );

  // ─── Estado del panel de detalle ──────────────────────────────────────────
  // selectedRequest: solicitud actualmente abierta en el panel lateral de detalle
  protected readonly selectedRequest = signal<ContactRequest | null>(null);
  // saving: deshabilita el botón de guardar mientras la operación async está en curso
  protected readonly saving = signal(false);

  // Formulario reactivo para actualizar estado y observación de una solicitud
  protected readonly updateForm = this.fb.group({
    estado: ['Pendiente' as 'Pendiente' | 'Atendida'],
    observacion: [''],
  });

  /**
   * @description Selecciona una solicitud para mostrar en el panel de detalle
   * y pre-carga sus valores actuales en el formulario de actualización.
   */
  protected selectRequest(req: ContactRequest): void {
    this.selectedRequest.set(req);
    this.updateForm.patchValue({
      estado: req.estado,
      observacion: req.observacion,
    });
  }

  /**
   * @description Cierra el panel de detalle limpiando la selección actual.
   */
  protected closeDetail(): void {
    this.selectedRequest.set(null);
  }

  /**
   * @description Persiste los cambios de estado y observación en Firestore.
   * La escucha en tiempo real actualizará automáticamente la lista tras el guardado.
   */
  protected async saveUpdate(): Promise<void> {
    const req = this.selectedRequest();
    if (!req || this.saving()) return;
    this.saving.set(true);
    try {
      await this.firestoreService.actualizarSolicitud(req.id, {
        estado: this.updateForm.value.estado as 'Pendiente' | 'Atendida',
        observacion: this.updateForm.value.observacion ?? '',
      });
      this.toast.show('Solicitud actualizada', 'success');
      // Se cierra el panel tras guardar; la lista se actualiza sola por el stream de Firestore
      this.closeDetail();
    } finally {
      this.saving.set(false);
    }
  }
}
