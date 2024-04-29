import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { MenuComponent } from "../components/menu/menu.component";
import { Historia } from '../interface/Historia';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historia-configuracion',
  standalone: true,
  templateUrl: './historia-configuracion.component.html',
  styleUrl: './historia-configuracion.component.css',
  imports: [CKEditorModule, FormsModule, SidebarComponent, MenuComponent,ReactiveFormsModule,CommonModule]
})
export class HistoriaConfiguracionComponent  implements OnInit{

  listahistorias: Historia[];
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() data: string = '';
  historiaform: FormGroup;
  historias: Historia[];
  historiaSeleccionada: number=0;
  his: Historia;
  
  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
}

  constructor(private Service: Service){}

  ngOnInit(): void {    
    this.cargarListaHistoria();
    this.cargarFormulario(this.his);
  }
  

  guardarEditarHistoria() {
    if (!this.historiaform.invalid) {
      const historia : Historia={id:this.historiaform.get('id')?.value || 0,hc:this.historiaform?.get('hc')?.value,nombre:this.historiaform.get('nombre')?.value}
      this.Service.postData('PostHistoria',historia).subscribe(
        (result:Historia[])=>{
          this.data="";
         this.listahistorias=result;
         this.historias=result;
         this.historiaform.get('hc')?.setValue(''); // Contenido de la historia
         this.historiaform.get('id')?.setValue(0); // ID de la historia
         this.historiaform.get('nombre')?.setValue(''); // No
         this.historiaSeleccionada=0;
        }
      )
    }
  };

 
  cargarFormulario(his:Historia) {
    this.historiaform = new FormGroup({
      hc:new FormControl(),
      id:new FormControl(),
      nombre:new FormControl(),
    })
  }

  cargarListaHistoria(){
    this.Service.getUnico('GetAllHistorias').subscribe(
      (data: Historia[]) => {
        if(data!=null){
        this.historias=data;
      }}
    );
  }

  onHistoriaChange($event: any) {
    if(this.historiaSeleccionada==0){
      this.historiaform.get('hc')?.setValue(''); // Contenido de la historia
      this.historiaform.get('id')?.setValue(0); // ID de la historia
      this.historiaform.get('nombre')?.setValue(''); // No
    }else{
    const histo = this.historias.find(historia => historia.id == this.historiaSeleccionada);
    if (histo != null) {
      this.historiaform.get('hc')?.setValue(histo.hc); // Contenido de la historia
      this.historiaform.get('id')?.setValue(histo.id); // ID de la historia
      this.historiaform.get('nombre')?.setValue(histo.nombre); // Nombre de la historia
      setTimeout(() => this.ajustarAltura(document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement), 0);
    }
  }
 }
}

