import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextareaExpand]',
})
export class TextareaExpandDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input') onInput() {
    this.adjust();
  }

  private adjust() {
    this.el.nativeElement.style.overflow = 'hidden';
    this.el.nativeElement.style.height = 'auto';
    this.el.nativeElement.style.height =
      this.el.nativeElement.scrollHeight + 'px';
  }
}
