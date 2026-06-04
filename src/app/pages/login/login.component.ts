import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  Injector,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';

function parseFirebaseError(error: unknown): string {
  const code = (error as { code?: string }).code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/user-not-found':
      return 'Usuario no encontrado';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/invalid-credential':
      return 'Credenciales inválidas';
    default:
      return 'Ocurrió un error. Intenta de nuevo.';
  }
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly injector = inject(Injector);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly capsLockOn = signal(false);

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected checkCapsLock(event: KeyboardEvent | MouseEvent): void {
    this.capsLockOn.set(event.getModifierState('CapsLock'));
  }

  private navigateAfterLogin(): void {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    const checkRole = effect(() => {
      if (!this.auth.isLoading()) {
        if (this.auth.isProgrammer()) {
          this.router.navigate(['/dashboard/programador']);
        } else if (this.auth.isAuthenticated()) {
          redirect
            ? this.router.navigateByUrl(redirect)
            : this.router.navigate(['/dashboard/usuario']);
        }
        checkRole.destroy();
      }
    }, { injector: this.injector });
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.auth.loginWithEmail(
        this.form.value.email!,
        this.form.value.password!,
      );
      this.navigateAfterLogin();
    } catch (e) {
      this.errorMessage.set(parseFirebaseError(e));
      this.submitting.set(false);
    }
  }

  protected async loginWithGoogle(): Promise<void> {
    this.errorMessage.set(null);
    try {
      await this.auth.loginWithGoogle();
      this.navigateAfterLogin();
    } catch (e) {
      this.errorMessage.set(parseFirebaseError(e));
    }
  }
}
