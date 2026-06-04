import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({ selector: '[appFadeIn]' })
export class FadeInDirective implements OnInit {
  private readonly el = inject(ElementRef);

  ngOnInit(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
  }
}
