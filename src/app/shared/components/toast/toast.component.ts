import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.currentToasts(); track toast.id) {
        <div [class]="getToastClass(toast.type)" class="shadow-lg max-w-sm flex items-center justify-between gap-3 pr-2">
          <span>{{ toast.message }}</span>
          <button
            (click)="toastService.remove(toast.id)"
            class="btn btn-ghost btn-xs shrink-0"
            [attr.aria-label]="'Cerrar notificación'"
          >✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  protected getToastClass(type: ToastType): string {
    const map: Record<ToastType, string> = {
      success: 'alert alert-success',
      error: 'alert alert-error',
      warning: 'alert alert-warning',
      info: 'alert alert-info',
    };
    return map[type];
  }
}
