import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';

function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (!password || !confirm) return null;
  return password.value !== confirm.value ? { passwordMismatch: true } : null;
}

function parseFirebaseError(error: unknown): string {
  const code = (error as { code?: string }).code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    default:
      return 'Ocurrió un error. Intenta de nuevo.';
  }
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);
  protected readonly capsLockOn = signal(false);

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  protected checkCapsLock(event: KeyboardEvent | MouseEvent): void {
    this.capsLockOn.set(event.getModifierState('CapsLock'));
  }

  protected readonly form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.auth.registerWithEmail(
        this.form.value.email!,
        this.form.value.password!,
        this.form.value.nombre!,
      );
      this.router.navigate(['/dashboard/usuario']);
    } catch (e) {
      this.errorMessage.set(parseFirebaseError(e));
      this.submitting.set(false);
    }
  }
}
