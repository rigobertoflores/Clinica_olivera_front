import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImagenPaciente } from '../interface/ImagenPaciente';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private api = 'https://localhost:7210/CliniaOv/CliniaOvController/';

  constructor(private http: HttpClient) {}

  getUnico(nombre_api: string): Observable<any> {
    return this.http.get<any>(this.api + nombre_api);
  }

  getUnicoParams(nombre_api: string,id: string | number): Observable<any> {
    return this.http.get<any>(`${this.api}${nombre_api}/${id}`);
  }

  getList(nombre_api: string): Observable<any[]> {
    return this.http.get<any[]>(this.api + nombre_api);
  }

  getListParams(nombre_api: string,id:string | number): Observable<ImagenPaciente[]> {
    return this.http.get<ImagenPaciente[]>(`${this.api}${nombre_api}/${id}`);
  }
}
