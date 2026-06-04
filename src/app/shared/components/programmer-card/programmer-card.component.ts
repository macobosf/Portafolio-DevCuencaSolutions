import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Programmer } from '../../../core/mock-data';

@Component({
  selector: 'app-programmer-card',
  imports: [RouterLink],
  templateUrl: './programmer-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgrammerCardComponent {
  readonly programmer = input.required<Programmer>();
}
