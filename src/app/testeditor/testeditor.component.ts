import { Component, ElementRef, EventEmitter, Input, OnInit, Output,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { RecetaxPaciente } from '../interface/RecetaxPaciente';
import { CommonModule } from '@angular/common';
import { Service } from './../Services/Service';
import { Tratamiento } from '../interface/Tratamiento';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-testeditor',
  standalone: true,
  imports: [CKEditorModule,FormsModule,CommonModule],
  templateUrl: './testeditor.component.html',
  styleUrl: './testeditor.component.css'
})
export class TesteditorComponent implements OnInit {
  Loading: boolean;
  allTreatments: Tratamiento[];
  treatments: Tratamiento[];

  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() recetas: RecetaxPaciente[];
  @Input() clave: string;
  @Input() fechaActual: string ;

  public model = {
    editorData: '<p>Hello, world!</p>'
};
  data: string="";
tratamientos: any;
tratamientoSeleccionado: number=0;

  constructor(private el: ElementRef,private Service: Service,) { }
  
  ngOnInit(): void {
    this.getTreatments();
  }

  saveText() {    
  // const datos = { id: this.id, data: this.data };
  // this.datosDisponibles.emit(datos);    
  }
  



 onChange( {editor} : ChangeEvent  ) {
      const data = editor.getData();
      // const dataactualiza={id:this.id,data:data}
      // this.testeditordata.emit("sdfsdfsdfsdf");  
  }

  printDocument(): void {
    window.print();
  }

  // GuardarReceta(receta:any) {  
  // }

  guardarEditarreceta(data:[id:number,data:string]) {
      if(data[1]!=null){
        const receta : RecetaxPaciente={clave:this.clave || "0",receta:data[1],fecha: this.fechaActual,id:data[0]}
        this.Service.postData('PostReceta',receta).subscribe(
          (result:RecetaxPaciente[])=>{
            this.data="";
           this.recetas=result;
           console.log(result);
          }
        )
      }
    };
  
    borrarreceta(data:[id:number,data:string]) {
      if(data[1]!=null){
        const receta : RecetaxPaciente={clave:this.clave || "0",receta:data[1],fecha: this.fechaActual,id:data[0]}
        this.Service.postData('PostDeleteReceta',receta).subscribe(
          (result:RecetaxPaciente[])=>{
            this.data="";
           this.recetas=result;
           console.log(result);
          }
        )
      }
    };

    printContent(notas:any) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if(printWindow){
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write(notas);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
    }

  

    getTreatments() {
      this.Loading = true; // Iniciar carga
      this.Service.GetTratamiento().subscribe({
        next: (result: Tratamiento[]) => {
          this.allTreatments = result.sort((a, b) => a.nombre.localeCompare(b.nombre));
          this.treatments = this.allTreatments;
        },
        error: (error) => {
          // Manejar error aquí
        },
        complete: () => {
          this.Loading = false; // Finalizar carga
        }
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


      guardarTratamientoReceta(data:[id:number,data:string]) {
          if(this.tratamientoSeleccionado==0 && data[1]!=null){
            return;
          }else{
            const trat= this.allTreatments.find(tratamiento => tratamiento.id == this.tratamientoSeleccionado);
            const receta= this.recetas.find(receta => receta.id == data[0]);
            if(receta!=null && trat && trat.tratamiento !== null){
             receta.receta+= '<p>'+trat.tratamiento;+'</p>'
            }else{
            if (trat && trat.tratamiento !== null) {
              this.data +='<p>'+trat.tratamiento;+'</p>'  // Agregar el contenido de histo.hc al final de this.data
            }}
          }
          this.tratamientoSeleccionado=0;
          
      }

      
}
