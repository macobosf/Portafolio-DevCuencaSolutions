import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { FirestoreService } from '../../core/firestore.service';
import { ContactRequest } from '../../core/mock-data';
import { RequestBadgeComponent } from '../../shared/components/request-badge/request-badge.component';

@Component({
  selector: 'app-dashboard-programmer',
  imports: [RouterLink, ReactiveFormsModule, RequestBadgeComponent],
  templateUrl: './dashboard-programmer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProgrammerComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly firestoreService = inject(FirestoreService);

  private readonly programadorId = this.auth.programadorId();

  protected readonly requests = toSignal(
    this.programadorId
      ? this.firestoreService.obtenerSolicitudesPorProgramador(
          this.programadorId,
        )
      : of([] as ContactRequest[]),
    { initialValue: [] as ContactRequest[] },
  );

  protected readonly pendingCount = computed(
    () => this.requests().filter((r) => r.estado === 'Pendiente').length,
  );
  protected readonly respondedCount = computed(
    () => this.requests().filter((r) => r.estado === 'Atendida').length,
  );

  protected readonly selectedRequest = signal<ContactRequest | null>(null);
  protected readonly saving = signal(false);

  protected readonly updateForm = this.fb.group({
    estado: ['Pendiente' as 'Pendiente' | 'Atendida'],
    observacion: [''],
  });

  protected selectRequest(req: ContactRequest): void {
    this.selectedRequest.set(req);
    this.updateForm.patchValue({
      estado: req.estado,
      observacion: req.observacion,
    });
  }

  protected closeDetail(): void {
    this.selectedRequest.set(null);
  }

  protected async saveUpdate(): Promise<void> {
    const req = this.selectedRequest();
    if (!req || this.saving()) return;
    this.saving.set(true);
    try {
      await this.firestoreService.actualizarSolicitud(req.id, {
        estado: this.updateForm.value.estado as 'Pendiente' | 'Atendida',
        observacion: this.updateForm.value.observacion ?? '',
      });
      this.closeDetail();
    } finally {
      this.saving.set(false);
    }
  }
}
