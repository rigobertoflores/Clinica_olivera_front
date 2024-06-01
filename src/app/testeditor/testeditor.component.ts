import { Component, ElementRef, EventEmitter, Input, OnInit, Output, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { RecetaxPaciente } from '../interface/RecetaxPaciente';
import { CommonModule } from '@angular/common';
import { Service } from './../Services/Service';
import { Tratamiento } from '../interface/Tratamiento';
import Swal from 'sweetalert2';
import { PrintText } from '../interface/PrintText';
import { UserService } from '../Services/user.service';
@Component({
  selector: 'app-testeditor',
  standalone: true,
  imports: [CKEditorModule, FormsModule, CommonModule],
  templateUrl: './testeditor.component.html',
  styleUrl: './testeditor.component.css',
})
export class TesteditorComponent implements OnInit {
  Loading: boolean;
  allTreatments: Tratamiento[];
  treatments: Tratamiento[];

  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() recetas: RecetaxPaciente[];
  @Input() clave: string;
  @Input() fechaActual: string;

  public model = {
    editorData: '<p>Hello, world!</p>',
  };
  data: string = '';
  tratamientos: any;
  tratamientoSeleccionado: number = 0;
  user: string;

  constructor(
    private el: ElementRef,
    private Service: Service,
    private authService: UserService
  ) {}

  ngOnInit(): void {
    this.getTreatments();
  }

  saveText() {
    // const datos = { id: this.id, data: this.data };
    // this.datosDisponibles.emit(datos);
  }

  onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    // const dataactualiza={id:this.id,data:data}
    // this.testeditordata.emit("sdfsdfsdfsdf");
  }

  guardarEditarreceta(data: [id: number, data: string]) {
    if (data[1] != null) {
      const receta: RecetaxPaciente = {
        clave: this.clave || '0',
        receta: data[1],
        fecha: this.fechaActual,
        id: data[0],
      };
      this.Service.postData('PostReceta', receta).subscribe(
        (result: RecetaxPaciente[]) => {
          this.data = '';
          this.recetas = result;
          console.log(result);
        }
      );
    }
  }

  borrarreceta(data: [id: number, data: string]) {
    if (data[1] != null) {
      const receta: RecetaxPaciente = {
        clave: this.clave || '0',
        receta: data[1],
        fecha: this.fechaActual,
        id: data[0],
      };
      this.Service.postData('PostDeleteReceta', receta).subscribe(
        (result: RecetaxPaciente[]) => {
          this.data = '';
          this.recetas = result;
          console.log(result);
        }
      );
    }
  }

  printContent(notas: any) {
    
    if (notas != null) {
      if (this.authService.isAuthenticated()) {
        const userJson = localStorage.getItem('user');
        console.log(this.authService, '1');
        if (userJson) {
          this.user = JSON.parse(userJson).email.split('@')[0];
        }
      }

      const printext: PrintText = { text: notas,user:this.user };
      this.Service.postData('Print', printext).subscribe(
        (pdfBlob: any) => {
          if (pdfBlob.fileContents) {
            const binaryString = window.atob(pdfBlob.fileContents);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: pdfBlob.contentType });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          } else {
            console.error('No data received or invalid blob');
          }
        },
        (error) => {
          console.error('Error downloading the PDF:', error);
        }
      );
    }
  }

  getTreatments() {
    this.Loading = true; // Iniciar carga
    this.Service.GetTratamiento().subscribe({
      next: (result: Tratamiento[]) => {
        this.allTreatments = result.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        this.treatments = this.allTreatments;
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {
        this.Loading = false; // Finalizar carga
      },
    });
  }

    
    confirmartratamiento(data:[id:number,data:string]){
      const trat= this.allTreatments.find(tratamiento => tratamiento.id == this.tratamientoSeleccionado);
      Swal.fire({
        title: 'Seguro desea agregar el tratamiento: ' + trat?.nombre,
        heightAuto: true,
        width: 'auto',
        padding: '1em',
        text: 'Tratamiento : ' + trat?.tratamiento,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Agregar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardarTratamientoReceta(data);
        } else this.tratamientoSeleccionado = 0;
      });
    }

  guardarTratamientoReceta(data: [id: number, data: string]) {
    if (this.tratamientoSeleccionado == 0 && data[1] != null) {
      return;
    } else {
      const trat = this.allTreatments.find(
        (tratamiento) => tratamiento.id == this.tratamientoSeleccionado
      );
      const receta = this.recetas.find((receta) => receta.id == data[0]);
      if (receta != null && trat && trat.tratamiento !== null) {
        receta.receta += '<p>' + trat.tratamiento;
        +'</p>';
      } else {
        if (trat && trat.tratamiento !== null) {
          this.data += '<p>' + trat.tratamiento;
          +'</p>'; // Agregar el contenido de histo.hc al final de this.data
        }
      }
    }
    this.tratamientoSeleccionado = 0;
  }
}
