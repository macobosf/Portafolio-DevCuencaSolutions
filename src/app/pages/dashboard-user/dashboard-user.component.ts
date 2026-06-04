import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { FirestoreService } from '../../core/firestore.service';
import { ContactRequest, PROGRAMADORES } from '../../core/mock-data';
import { RequestBadgeComponent } from '../../shared/components/request-badge/request-badge.component';

@Component({
  selector: 'app-dashboard-user',
  imports: [RouterLink, RequestBadgeComponent],
  templateUrl: './dashboard-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardUserComponent {
  protected readonly auth = inject(AuthService);
  private readonly firestoreService = inject(FirestoreService);

  private readonly uid = this.auth.currentUser()?.uid;

  protected readonly requests = toSignal(
    this.uid
      ? this.firestoreService.obtenerSolicitudesPorUsuario(this.uid)
      : of([] as ContactRequest[]),
    { initialValue: [] as ContactRequest[] },
  );

  protected getProgramadorNombre(id: string): string {
    return PROGRAMADORES.find((p) => p.id === id)?.nombre ?? 'Desconocido';
  }
}
