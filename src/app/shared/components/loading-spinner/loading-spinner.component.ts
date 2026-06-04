import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="flex items-center justify-center min-h-[60vh]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
