import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Historia } from '../interface/Historia';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { Expediente } from '../interface/Expediente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-testeditor-historia',
  standalone: true,
  imports: [CKEditorModule,FormsModule,ReactiveFormsModule,CommonModule ],
  templateUrl: './testeditor-historia.component.html',
  styleUrl: './testeditor-historia.component.css'
})
export class TesteditorHistoriaComponent implements OnInit,AfterViewInit {


  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() parametro: string= '';
  listahistorias: Historia[];
  historias: Historia[];
  historiaSeleccionada: number=0;
  his: Historia;
  expediente: Expediente;



  constructor(private Service: Service){}
  
  ngOnInit(): void {
    this.cargarExpedientePaciente(this.parametro);
    this.cargarListaHistoria();
   this.expediente={
    clave:parseInt(this.parametro),
    expediente1:"",
    id:0,
    historiaId:""
  };
  }

  ngAfterViewInit(): void {
    this.ajustarAltura(document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement);
  
 }

  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
}
  cargarListaHistoria(){
    this.Service.getUnico('GetAllHistorias').subscribe(
      (data: Historia[]) => {
        if(data!=null){
        this.historias=data;
      }}
    );
  }

  
 guardarHistoriaExpediente() {
  if(this.historiaSeleccionada==0){
    return;
  }else{
    const histo= this.historias.find(historia => historia.id == this.historiaSeleccionada);
    if (histo && histo.hc !== null) {
      this.expediente.expediente1 += histo.hc; // Agregar el contenido de histo.hc al final de this.data
      this.expediente.historiaId=this.historiaSeleccionada.toString();
      setTimeout(() => this.ajustarAltura(document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement), 0);
    }
  }
  }

  subcribeExpediente(){
    
  }

  cargarExpedientePaciente(parametrourl:any){
    this.Service.getUnicoParams('GetExpediente', parametrourl).subscribe(
      (data: Expediente) => {
        if(data!=null){
        this.expediente={
          clave:data.clave,
          expediente1: data.expediente1 || "",
          id:data.id,
          historiaId:data.historiaId
        }       
        }
      setTimeout(() => this.ajustarAltura(document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement), 0);
    }
    );
 
  }

  

  guardarHistoriadentroExpediente() {
    let expedienteresult:Expediente;  
      expedienteresult=this.expediente;

      this.Service.postData('PostExpediente',expedienteresult).subscribe(
        (result)=>{
            this.expediente={
              clave:this.expediente.clave,
              expediente1:result.expediente1 || "",
              id:result.id,
              historiaId:result.historiaId
              
            }
            setTimeout(() => this.ajustarAltura(document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement), 0);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se actualizó la historia del paciente',
              showConfirmButton: false,
              timer: 2000,
            });
        }
      )   
    
    // else{
    //   const expediente= this.historias.find(historia => historia.id == this.historiaSeleccionada);
    //    expediente={
    //    hc:this.data,
    //    id:

    //    };
    // }
      
   
    }

    
}
