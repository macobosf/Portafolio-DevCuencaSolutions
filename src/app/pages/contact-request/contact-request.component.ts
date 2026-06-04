import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FirestoreService } from '../../core/firestore.service';
import { PROGRAMADORES } from '../../core/mock-data';

@Component({
  selector: 'app-contact-request',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRequestComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    if (this.auth.isProgrammer()) {
      this.router.navigate(['/dashboard/programador']);
      return;
    }
  }
  private readonly firestoreService = inject(FirestoreService);

  protected readonly programadores = PROGRAMADORES;
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.group({
    nombre: [
      this.auth.getUserName(),
      [Validators.required, Validators.minLength(3)],
    ],
    correo: [
      this.auth.currentUser()?.email ?? '',
      [Validators.required, Validators.email],
    ],
    programadorId: [PROGRAMADORES[0]?.id ?? '1', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      const uid = this.auth.currentUser()!.uid;
      const programadorId = this.form.value.programadorId!;
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
        fechaCreacion: new Date().toISOString().substring(0, 10),
        estado: 'Pendiente',
        observacion: '',
      });
      this.submitted.set(true);
    } catch {
      this.errorMessage.set('Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      this.submitting.set(false);
    }
  }

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
