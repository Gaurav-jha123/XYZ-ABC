import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OmniServerServiceService {
  private apiUrl = 'http://localhost:8080/chat'; 

  constructor(private http: HttpClient) {}

  sendRequestToOmniparser(userMessage: string, sessionId: string) {
    const body = {
      query: userMessage,
      session_id: sessionId
    };
    return this.http.post(this.apiUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
