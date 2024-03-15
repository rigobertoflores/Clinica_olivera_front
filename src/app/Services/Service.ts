import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ImagenPaciente } from '../interface/ImagenPaciente';
import { FotoPaciente } from '../interface/FotoPaciente';

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

  getListFotoPacienteParams(nombre_api: string,id:string | number): Observable<FotoPaciente[]> {
    return this.http.get<FotoPaciente[]>(`${this.api}${nombre_api}/${id}`);
  }

  // postenviarDatosPaciente(data:any,nombre_api:string ): Observable<any> {
  //   // Asumiendo que `data` es el objeto con los datos del formulario
  //   const url = `${this.api}${nombre_api}`; // Reemplaza con la URL de tu API
  //   fetch(url, {
  //     method: 'POST', // o 'PUT' si estás actualizando un registro existente
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data), // Convierte los datos del formulario a una cadena JSON
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     return data;
  //   })
  //   .catch((error) => {
  //     return error;
  //   });
  // }

  postData(
    nombre_api:string,
    data: any
): Observable<any> {
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
}
