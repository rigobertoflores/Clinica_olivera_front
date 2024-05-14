import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../components/menu/menu.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { ConfiguracionImpresion } from '../interface/ConfiguracionImpresion';

@Component({
    selector: 'app-configuracion-impresion',
    standalone: true,
    templateUrl: './configuracion-impresion.component.html',
    styleUrl: './configuracion-impresion.component.css',
    imports: [MenuComponent, SidebarComponent]
})
export class ConfiguracionImpresionComponent implements OnInit{
  historias: ConfiguracionImpresion[];

  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
