import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { MenuComponent } from "../components/menu/menu.component";
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { informeoperatorio } from '../interface/informeoperatorio';

@Component({
  selector: 'app-informeso-configuracion',
  standalone: true,
  templateUrl: './informeso-configuracion.component.html',
  styleUrl: './informeso-configuracion.component.css',
  imports: [CKEditorModule, FormsModule, SidebarComponent, MenuComponent,ReactiveFormsModule,CommonModule]
})
export class InformesoConfiguracionComponent  implements OnInit{

  listainforme: informeoperatorio[];
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() data: string = '';
  informeform: FormGroup;
  informe: informeoperatorio[];
  informeeleccionada: number=0;
  his: informeoperatorio;
  
  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
}

  constructor(private Service: Service){}

  ngOnInit(): void {    
    this.cargarListaInformeform();
    this.cargarFormulario(this.his);
  }
  

  guardarEditarInforme() {
    if (!this.informeform.invalid) {
      const infor : informeoperatorio={id:this.informeform.get('id')?.value || 0,informe:this.informeform?.get('informe')?.value,nombre:this.informeform.get('nombre')?.value}
      this.Service.postData('PostInformeo',infor).subscribe(
        (result:informeoperatorio[])=>{
          this.data="";
         this.listainforme=result;
         this.informe=result;
         this.informeform.get('informe')?.setValue(''); // Contenido de la historia
         this.informeform.get('id')?.setValue(0); // ID de la historia
         this.informeform.get('nombre')?.setValue(''); // No
         this.informeeleccionada=0;
        }
      )
    }
  };

 
  cargarFormulario(his:informeoperatorio) {
    this.informeform = new FormGroup({
      informe:new FormControl(),
      id:new FormControl(),
      nombre:new FormControl(),
    })
  }

  cargarListaInformeform(){
    this.Service.getUnico('GetAllInformeo').subscribe(
      (data: informeoperatorio[]) => {
        if(data!=null){
        this.informe=data;
      }}
    );
  }

  onInformeChange($event: any) {
    if(this.informeeleccionada==0){
      this.informeform.get('informe')?.setValue(''); // Contenido de la historia
      this.informeform.get('id')?.setValue(0); // ID de la historia
      this.informeform.get('nombre')?.setValue(''); // No
    }else{
    const inf = this.informe.find(info => info.id == this.informeeleccionada);
    if (inf != null) {
      this.informeform.get('informe')?.setValue(inf.informe); // Contenido de la historia
      this.informeform.get('id')?.setValue(inf.id); // ID de la historia
      this.informeform.get('nombre')?.setValue(inf.nombre); // Nombre de la historia
      setTimeout(() => this.ajustarAltura(document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement), 0);
    }
  }
 }
}

