import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-request-badge',
  imports: [],
  templateUrl: './request-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestBadgeComponent {
  readonly estado = input.required<'Pendiente' | 'Atendida'>();

  protected readonly badgeClass = computed(() =>
    this.estado() === 'Atendida'
      ? 'badge badge-success gap-1'
      : 'badge badge-warning gap-1',
  );
}
