import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CaptureElementService } from '../services/capture-element-service.service';
import { OmniServerServiceService } from '../services/omni-server-service.service';
import { ScreenshotService } from '../services/screenshot.service';
import markdownit from 'markdown-it';

@Component({
  selector: 'app-sidebar',
  standalone: true,  // ✅ Declares this as a standalone component
  imports: [NgClass, FormsModule, CommonModule],  // ✅ Import common directives used in the template
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(
    private captureService: CaptureElementService,
    private http: HttpClient, private screenshotService: ScreenshotService,
    private omniServerService: OmniServerServiceService,
  ) { }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isChatIconShown = !this.isSidebarOpen;
  }

  isSidebarOpen = false;
  userPrompt = '';
  previewImageUrl: string | null = null;
  imageBase64: string | null = null;
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  md = new markdownit();
  tempPrompt = '';
  isLoading = false;
  isChatIconShown = true;

  async sendRequestToAI() {
    this.messages.push({ text: this.userPrompt, sender: 'user' });
    this.tempPrompt = this.userPrompt;
    this.clearChat();
    this.isLoading = true;

    const elementRef = this.captureService.getElementRef();

    if (!elementRef) {
      console.error('CaptureElementDirective not found in CaptureElementService!');
      return;
    }

    try {
      const screenshotBase64 = await this.screenshotService.captureElement(elementRef.nativeElement);
      const imageFile = this.downloadImage(screenshotBase64);

      this.omniServerService.sendRequestToOmniparser(this.tempPrompt, imageFile)
        .subscribe((response: { gemini_response?: string }) => {
          console.log("✅ Omniparser Response:", response);

          let formattedResponse = "⚠️ Invalid response format!";
          try {
            const rawText = response?.gemini_response || "";

            const match = rawText.match(/```json\s*([\s\S]*?)\s*```/);
            console.log("Matched JSON:", match);

            const jsonString = match
              ? match[1].trim().replace(/\\n/g, '').replace(/\\+\"/g, '"')//.replace(/\\\"/g, '')
              : null;
            console.log("JSON String:", jsonString);

            if (jsonString) {
              // 🔹 Parse JSON string
              const parsedResponse = JSON.parse(jsonString);

              // ✅ Differentiate explanation, targetControlId, and actionInstruction
              formattedResponse = `
                <div class="bot-message" style="font-size: 14px">
                  <span style="font-weight:bold">Explanation:</span>
                  <p>${parsedResponse.explanation}</p>
                  <span style="font-weight:bold">Target Control ID:</span>
                  <p>${parsedResponse.targetControlId || 'N/A'}</p>
                  <span style="font-weight:bold">Action Instruction:</span>
                  <p>${parsedResponse.actionInstruction || 'N/A'}</p>
                </div>
              `;
            } else {
              formattedResponse = "<p>⚠️ No valid JSON found in response!</p>";
            }
          } catch (error) {
            console.error("❌ Error parsing JSON:", error);
            formattedResponse = "⚠️ Error parsing AI response!";
          }

          this.messages.push({ text: formattedResponse, sender: 'bot' })
          this.isLoading = false;
        }, error => {
          console.error("Error sending request:", error);
          this.isLoading = false;
        });

    } catch (error) {
      console.error("Screenshot capture failed:", error);
    }
  }

  downloadImage(imageBase64: string, fileName: string = 'screenshot.png'): File {

    const byteCharacters = atob(imageBase64.split(',')[1]);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: 'image/png' });
    const file = new File([blob], fileName, { type: 'image/png' });

    return file;
  }

  clearChat() {
    this.userPrompt = '';
  }
}
