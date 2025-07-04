import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../services/employee.service';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('richTextEditor', { static: false }) richTextEditor!: ElementRef;
  
  isExpanded = false;
  messages: ChatMessage[] = [];
  isTyping = false;
  currentMessage: string = '';

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.initializeChat();
  }

  initializeChat(): void {
    this.messages = [
      {
        id: '1',
        text: 'Hello! I\'m your HCM Assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date()
      },
      {
        id: '2',
        text: 'You can ask me about:\n• Employee management\n• Leave requests\n• Exit processes\n• Dashboard overview\n• Navigation help',
        isUser: false,
        timestamp: new Date()
      }
    ];
  }

  toggleChatbot(): void {
    this.isExpanded = !this.isExpanded;
  }

  sendMessage(): void {
    const editorContent = this.richTextEditor?.nativeElement?.innerHTML || this.currentMessage;
    const textContent = this.richTextEditor?.nativeElement?.textContent || this.currentMessage;
    
    if (!textContent.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: editorContent,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    this.employeeService.getChatbotResponse(textContent).subscribe(response => { 
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      this.messages.push(botMessage);
      this.isTyping = false;
      this.scrollToBottom();
    });
    
    const messageText = textContent.toLowerCase();
    this.currentMessage = '';
    if (this.richTextEditor?.nativeElement) {
      this.richTextEditor.nativeElement.innerHTML = '';
    }

    // Show typing indicator
    this.isTyping = true;


  }

  sendQuickMessage(message: string): void {
    this.currentMessage = message;
    this.sendMessage();
  }

  formatMessage(text: string): string {
    return text.replace(/\n/g, '<br>').replace(/•/g, '&bull;');
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.initializeChat();
  }

  formatText(command: string, value?: string): void {
    document.execCommand(command, false, value);
    this.richTextEditor.nativeElement.focus();
  }

  onEditorKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onEditorInput(): void {
    // Update current message for backup
    this.currentMessage = this.richTextEditor?.nativeElement?.textContent || '';
  }
}
