import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { informeexpediente } from '../interface/informexpediente';
import { informeoperatorio } from '../interface/informeoperatorio';
import { LoadingComponent } from '../loading/loading.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-testeditorinformeso',
  standalone: true,
  imports: [
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './testeditorinformeso.component.html',
  styleUrl: './testeditorinformeso.component.css',
})
export class TesteditorinformesoComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() parametro: string = '';
  listainforme: informeoperatorio[];
  informe: informeoperatorio[];
  informeeleccionada: number = 0;
  his: informeoperatorio;
  informeexpediente: informeexpediente;
  showLoading: boolean = false;

  constructor(private Service: Service) {}

  ngOnInit(): void {
    this.cargarinformeexpedientePaciente(this.parametro);
    this.cargarListaHistoria();
    this.informeexpediente = {
      clave: parseInt(this.parametro),
      informe: '',
      id: 0,
      informeid: '',
    };
  }

  ngAfterViewInit(): void {
    this.ajustarAltura(
      document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement
    );
  }

  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
  }
  cargarListaHistoria() {
    this.Service.getUnico('GetAllInformeo').subscribe(
      (data: informeoperatorio[]) => {
        if (data != null) {
          this.informe = data;
        }
      }
    );
  }

  guardarinformeexpediente() {
    if (this.informeeleccionada == 0) {
      return;
    } else {
      const histo = this.informe.find(
        (historia) => historia.id == this.informeeleccionada
      );
      if (histo && histo.informe !== null) {
        this.informeexpediente.informe += histo.informe; // Agregar el contenido de histo.hc al final de this.data
        this.informeexpediente.informeid = this.informeeleccionada.toString();
        setTimeout(
          () =>
            this.ajustarAltura(
              document.getElementById(
                'nombreinputtexthistoria'
              ) as HTMLTextAreaElement
            ),
          0
        );
      }
    }
  }

  subcribeinformeexpediente() {}

  cargarinformeexpedientePaciente(parametrourl: any) {
    this.Service.getUnicoParams('GetInforme', parametrourl).subscribe(
      (data: informeexpediente) => {
        if (data != null) {
          this.informeexpediente = {
            clave: data.clave,
            informe: data.informe || '',
            id: data.id,
            informeid: data.informeid,
          };
        }
        setTimeout(
          () =>
            this.ajustarAltura(
              document.getElementById(
                'nombreinputtexthistoria'
              ) as HTMLTextAreaElement
            ),
          0
        );
      }
    );
  }

  guardarinformedentroexpediente() {
    this.showLoading = true;
    let informeexpedienteresult: informeexpediente;
    informeexpedienteresult = this.informeexpediente;

    this.Service.postData(
      'PostInformeExpediente',
      informeexpedienteresult
    ).subscribe((result) => {
      this.informeexpediente = {
        clave: result.clave,
        informe: result.informe || '',
        id: result.id,
        informeid: result.informeid,
      };
      setTimeout(
        () =>
          this.ajustarAltura(
            document.getElementById(
              'nombreinputtexthistoria'
            ) as HTMLTextAreaElement
          ),
        0
      );
      this.showLoading = false;
       Swal.fire({
         position: 'center',
         icon: 'success',
         title: 'Se ha guardado correctamente el informe',
         showConfirmButton: false,
         timer: 3000,
       });
    });

    // else{
    //   const informeexpediente= this.informe.find(historia => historia.id == this.informeeleccionada);
    //    informeexpediente={
    //    hc:this.data,
    //    id:

    //    };
    // }
  }
}
