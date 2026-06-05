import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  template: `
    @if (showButton()) {
      <button
        (click)="scrollToTop()"
        aria-label="Volver arriba"
        class="fixed bottom-6 right-6 z-50 btn btn-primary rounded-full w-12 h-12 shadow-lg transition-all duration-300 flex items-center justify-center p-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
        </svg>
      </button>
    }
  `,
})
export class ScrollToTopComponent implements OnInit {
  protected readonly showButton = signal(false);

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.showButton.set(window.scrollY > 300);
    });
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
