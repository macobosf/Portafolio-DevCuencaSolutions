import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div class="animate-pulse">
      @if (type() === 'card') {
        <div class="card bg-base-100 shadow-md">
          <div class="h-48 bg-gray-200 rounded-t-xl"></div>
          <div class="card-body gap-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            <div class="flex gap-2 mt-2">
              <div class="h-5 w-16 bg-gray-200 rounded-full"></div>
              <div class="h-5 w-16 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      }
      @if (type() === 'profile') {
        <div class="flex flex-col items-center gap-4 p-6">
          <div class="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div class="h-6 bg-gray-200 rounded w-48"></div>
          <div class="h-4 bg-gray-200 rounded w-32"></div>
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      }
      @if (type() === 'text') {
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      }
    </div>
  `,
})
export class SkeletonComponent {
  type = input<'card' | 'profile' | 'text'>('card');
}
