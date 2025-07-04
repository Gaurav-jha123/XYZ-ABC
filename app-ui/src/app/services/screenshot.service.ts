import { ElementRef, Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ScreenshotService {
  // capture(element: HTMLElement): Promise<string> {
  //   return html2canvas(element).then(canvas => {
  //     return canvas.toDataURL('image/png');
  //   });
  // }

  // downloadImage(imageData: string, fileName: string = 'screenshot.png') {
  //   const link = document.createElement('a');
  //   link.href = imageData;
  //   link.download = fileName;
  //   link.click();
  // }

  // captureScreenshot(captureElement: ElementRef) {
  //   if (!captureElement) return;

  //   const element = captureElement.nativeElement;

  //   this.capture(element).then(imageData => {
  //     this.downloadImage(imageData, 'products_screenshot.png');
  //   }).catch(error => {
  //     console.error('Screenshot capture failed', error);
  //   });
  // }

  async captureElement(element: HTMLElement): Promise<string> {
    try {
      const canvas = await html2canvas(element);
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      throw error;
    }
  }
}
