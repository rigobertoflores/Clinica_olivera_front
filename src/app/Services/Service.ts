import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private api = 'https://localhost:7210/CliniaOv/CliniaOvController/';

  constructor(private http: HttpClient) {}

  getUnico(nombre_api: string): Observable<any> {
    return this.http.get<any>(this.api + nombre_api);
  }

  getList(nombre_api: string): Observable<any[]> {
    return this.http.get<any[]>(this.api + nombre_api);
  }
}
