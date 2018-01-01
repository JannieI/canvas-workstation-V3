import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDelay]'
})
export class DelayDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) { }

  @Input()
    appDelay(time: number): void {
    setTimeout(
        () => {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        },
        time);
    }
}