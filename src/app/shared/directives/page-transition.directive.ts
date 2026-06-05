import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appPageTransition]',
  standalone: true,
})
export class PageTransitionDirective implements OnInit {
  private readonly el = inject(ElementRef);

  ngOnInit(): void {
    const native = this.el.nativeElement as HTMLElement;
    native.style.opacity = '0';
    native.style.transform = 'translateY(10px)';
    native.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    setTimeout(() => {
      native.style.opacity = '1';
      native.style.transform = 'translateY(0)';
    }, 50);
  }
}
