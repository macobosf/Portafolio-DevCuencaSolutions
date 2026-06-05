import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit {
  readonly target = input<number>(0);
  readonly duration = input<number>(2000);
  private readonly el = inject(ElementRef);

  ngOnInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateCount();
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(this.el.nativeElement);
  }

  private animateCount(): void {
    const end = this.target();
    const duration = this.duration();
    const step = (end / duration) * 16;
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      this.el.nativeElement.textContent = Math.floor(current).toString();
    }, 16);
  }
}
