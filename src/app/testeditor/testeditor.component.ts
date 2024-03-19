import { Component, ElementRef, EventEmitter, Input, OnInit, Output,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { RecetaxPaciente } from '../interface/RecetaxPaciente';
import { CommonModule } from '@angular/common';
import { Service } from './../Services/Service';
@Component({
  selector: 'app-testeditor',
  standalone: true,
  imports: [CKEditorModule,FormsModule,CommonModule],
  templateUrl: './testeditor.component.html',
  styleUrl: './testeditor.component.css'
})
export class TesteditorComponent implements OnInit {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() recetas: RecetaxPaciente[];
  @Input() clave: string;
  @Input() fechaActual: string ;

  public model = {
    editorData: '<p>Hello, world!</p>'
};
  data: string="";

  constructor(private el: ElementRef,private Service: Service,) { }
  
  ngOnInit(): void {
   
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
}
