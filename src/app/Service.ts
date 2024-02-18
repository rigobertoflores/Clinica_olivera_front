import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service {

  private apiUrl = 'https://localhost:7210/MostrarTexto'; // Ajusta al URL de tu API

   constructor(private http: HttpClient) { }

  getTexto(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
