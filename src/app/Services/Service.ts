import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ImagenPaciente } from '../interface/ImagenPaciente';
import { FotoPaciente } from '../interface/FotoPaciente';

@Injectable({
  providedIn: 'root',
})
export class Service {
  //   private api = 'https://localhost:7210/CliniaOv/CliniaOvController/';
  //   private apiTratamientos =
  //     'https://localhost:7210/api/Tratamientos/TratamientosController/';
  private api =
    'https://clinicaolivera.azurewebsites.net/CliniaOv/CliniaOvController/';
  private apiTratamientos =
    'https://clinicaolivera.azurewebsites.net/api/Tratamientos/TratamientosController/';

  constructor(private http: HttpClient) {}

  getUnico(nombre_api: string): Observable<any> {
    return this.http.get<any>(this.api + nombre_api);
  }

  getUnicoParams(nombre_api: string, id: string | number): Observable<any> {
    return this.http.get<any>(`${this.api}${nombre_api}/${id}`);
  }

  getList(nombre_api: string): Observable<any[]> {
    return this.http.get<any[]>(this.api + nombre_api);
  }

  getListParams(nombre_api: string, id: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}${nombre_api}/${id}`);
  }

  getListFotoPacienteParams(
    nombre_api: string,
    id: string | number
  ): Observable<FotoPaciente[]> {
    return this.http.get<FotoPaciente[]>(`${this.api}${nombre_api}/${id}`);
  }

  postData(nombre_api: string, data: any): Observable<any> {
    const url1 = `${this.api}${nombre_api}`;
    return this.http.post(url1, data).pipe(
      map((response: any) => {
        if (response) {
          if (response.hasError && response.errorCode == 401) {
            return;
          }
          return response;
        } else {
          return [];
        }
      })
    );
  }
  GetTratamiento(): Observable<any> {
    const nombre_api = 'GetTratamientos';
    const url1 = `${this.apiTratamientos}${nombre_api}`;
    return this.http.get(url1).pipe(
      map((response: any) => {
        if (response) {
          if (response.hasError && response.errorCode == 401) {
            return;
          }
          return response;
        } else {
          return [];
        }
      })
    );
  }

  GetTratamientoId(nombre_api: string, data: any): Observable<any> {
    const url1 = `${this.apiTratamientos}${nombre_api}`;
    return this.http.post(url1, data).pipe(
      map((response: any) => {
        if (response) {
          if (response.hasError && response.errorCode == 401) {
            return;
          }
          return response;
        } else {
          return [];
        }
      })
    );
  }

  InsertTratamiento(nombre_api: string, data: any): Observable<any> {
    const url1 = `${this.apiTratamientos}${nombre_api}`;
    return this.http.post(url1, data).pipe(
      map((response: any) => {
        if (response) {
          if (response.hasError && response.errorCode == 401) {
            return;
          }
          return response;
        } else {
          return [];
        }
      })
    );
  }
  EditTratamiento(data: any): Observable<any> {
    const nombre_api = `EditTratamiento/${data.id}`;
    const url1 = `${this.apiTratamientos}${nombre_api}`;
    return this.http.post(url1, data).pipe(
      map((response: any) => {
        if (response) {
          if (response.hasError && response.errorCode == 401) {
            return;
          }
          return response;
        } else {
          return [];
        }
      })
    );
  }

  DeleteTratamiento(data: any): Observable<any> {
    const nombre_api = `DeleteTratamiento/${data}`;
    const url1 = `${this.apiTratamientos}${nombre_api}`;
    return this.http.delete(url1, data).pipe(
      map((response: any) => {
        if (response) {
          if (response.hasError && response.errorCode == 401) {
            return;
          }
          return response;
        } else {
          return [];
        }
      })
    );
  }

  PosTTratamiento(nombre_api: string, data: any): Observable<any> {
    const url1 = `${this.apiTratamientos}${nombre_api}`;
    return this.http.post(url1, data).pipe(
      map((response: any) => {
        if (response) {
          if (response.hasError && response.errorCode == 401) {
            return;
          }
          return response;
        } else {
          return [];
        }
      })
    );
  }
}
