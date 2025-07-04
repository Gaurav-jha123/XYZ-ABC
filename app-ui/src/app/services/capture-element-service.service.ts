import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaptureElementService {
  private elementRef?: ElementRef;

  setElementRef(element: ElementRef) {
    console.log('CaptureElementService - Element Set:', element.nativeElement);
    this.elementRef = element;
  }

  getElementRef(): ElementRef | undefined {
    return this.elementRef;
  }
}