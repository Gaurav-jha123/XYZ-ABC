import { Directive, ElementRef, OnInit } from '@angular/core';
import { CaptureElementService } from '../services/capture-element-service.service';

@Directive({
  selector: '[CaptureElement]',
  standalone: true
})
export class CaptureElementDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private captureService: CaptureElementService
  ) {}

  ngOnInit() {
    console.log('CaptureElementDirective initialized!', this.el.nativeElement);
    this.captureService.setElementRef(this.el);
  }
}