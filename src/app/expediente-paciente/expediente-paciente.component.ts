import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { Service } from './../Services/Service';
import { Paciente } from '../interface/Paciente';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StandaloneGalleryComponent } from '../standalone-gallery/standalone-gallery.component';
import { MatDialog } from '@angular/material/dialog';
import { ImagenPaciente } from '../interface/ImagenPaciente';
import { TesteditorComponent } from "../testeditor/testeditor.component";
import { Expediente } from '../interface/Expediente';

@Component({
    selector: 'app-expediente-paciente',
    standalone: true,
    templateUrl: './expediente-paciente.component.html',
    styleUrl: './expediente-paciente.component.css',
    imports: [MenuComponent, SidebarComponent, ReactiveFormsModule, CommonModule, StandaloneGalleryComponent, TesteditorComponent]
})
export class ExpedientePacienteComponent implements OnInit {
  parametro: string | null = null;
  pacientedatos: Paciente ;
  PacienteFormulario: FormGroup;
  images: { src: string; alt: string; }[];
  imagenesPaciente:ImagenPaciente[];
  expediente: Expediente;
  historia: string;
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();
  fechaFormateada: string;

  constructor(private route: ActivatedRoute, private Service: Service,public dialog: MatDialog) {
   
  }
   

  ngOnInit(): void {
    this.formatearfecha();
    this.parametro= this.route.snapshot.paramMap.get('id');
    if(this.parametro){
    this.cargarContenidoPaciente(this.parametro);
    this.cargarImagenPaciente(this.parametro);
    this.cargarHistoriaPaciente(this.parametro);
  }
  }
  

  cargarContenidoPaciente(parametrourl:any) {
    this.Service.getUnicoParams('GetPacienteId', parametrourl).subscribe(
      (data: Paciente) => {
        this.cargarFormulario(data);
        this.pacientedatos = data;
        
      }
    );
  }

  formatearfecha() {
    this.fechaFormateada = `${this.dia < 10 ? '0' + this.dia : this.dia}/${
      this.mes < 10 ? '0' + this.mes : this.mes
    }/${this.año}`;
  }
  
  cargarFormulario(data: Paciente) {
    this.PacienteFormulario = new FormGroup({
      clave:new FormControl(data.clave),
      sexo: new FormControl(
        data.sexo === 'F' ? 'Femenino' : data.sexo === 'M' ? 'Masculino' : data.sexo
      ),
      fechaDeNacimiento: new FormControl(this.formatDate(data.fechaDeNacimiento)),
      nombre: new FormControl(data.nombre),
      estadoCivil: new FormControl(data.estadoCivil === 'C.' || data.estadoCivil === 'C'  ? 'Casado' : data.estadoCivil === 'S' ? 'Soltero' : data.estadoCivil),
      ocupacion: new FormControl(data.ocupacion),
      domicilio: new FormControl(data.domicilio),
      poblacion: new FormControl(data.poblacion),
      telefono: new FormControl(data.telefono),
      email: new FormControl(data.email),
      nombreDelEsposo: new FormControl(data.nombreDelEsposo),
      edadDelEsposo: new FormControl(data.edadDelEsposo),
      ocupacionEsposo: new FormControl(data.ocupacionEsposo),
      referencia: new FormControl(data.referencia),
      diabetes: new FormControl(data.diabetes),
      hipertension: new FormControl(data.hipertension),
      trombosis: new FormControl(data.trombosis),
      cardiopatias: new FormControl(data.cardiopatias),
      cancer: new FormControl(data.cancer),
      enfermedadesGeneticas: new FormControl(data.enfermedadesGeneticas),
      otraEnfermedad: new FormControl(data.otraEnfermedad),
      inmunizaciones: new FormControl(data.inmunizaciones),
      alcoholismo: new FormControl(data.alcoholismo),
      tabaquismo: new FormControl(data.tabaquismo),
      tabaquismoPasivo: new FormControl(data.tabaquismoPasivo),
      drogasOmedicamentos: new FormControl(data.drogasOmedicamentos),
      grupoSanguineo: new FormControl(data.grupoSanguineo),
      propiasDeLaInfancia: new FormControl(data.propiasDeLaInfancia),
      rubeola: new FormControl(data.rubeola),
      amigdalitis: new FormControl(data.amigdalitis),
      bronquitis: new FormControl(data.bronquitis),
      bronconeumonia: new FormControl(data.bronconeumonia),
      hepatitisViralTipo: new FormControl(data.hepatitisViralTipo),
      parasitosis: new FormControl(data.parasitosis),
      toxoplasmosis: new FormControl(data.toxoplasmosis),
      citomegalovirus: new FormControl(data.citomegalovirus),
      herpes: new FormControl(data.herpes),
      clamydiasis: new FormControl(data.clamydiasis),
      hiv: new FormControl(data.hiv),
      sifilis: new FormControl(data.sifilis),
      micosis: new FormControl(data.micosis),
      eip: new FormControl(data.eip),
      diabetesMellitus: new FormControl(data.diabetesMellitus),
      otrasEndocrinas: new FormControl(data.otrasEndocrinas),
      nefropatias: new FormControl(data.nefropatias),
      digestivas: new FormControl(data.digestivas),
      neurologicas: new FormControl(data.neurologicas),
      hematologicas: new FormControl(data.hematologicas),
      tumores: new FormControl(data.tumores),
      condilomatosis: new FormControl(data.condilomatosis),
      displasias: new FormControl(data.displasias),
      alergia: new FormControl(data.alergia),
      fechaConsulta: new FormControl(data.fechaConsulta),
      fechaUltimaConsulta: new FormControl(data.fechaUltimaConsulta),
    });
  }

  formatDate(dateString: string): string {
    const fecha = new Date(dateString);
    return fecha.toISOString().split('T')[0];
  }

  openDialog(imageUrl: string): void {
    this.dialog.open(StandaloneGalleryComponent, {
      data: {
        img: imageUrl
      },
      panelClass: 'custom-dialog-container' // Opcional: para estilos personalizados3
    });
  }  

  cargarImagenPaciente(parametrourl:any) {
    this.Service.getListParams('GetImagenesPaciente', parametrourl).subscribe(
      (data: ImagenPaciente[]) => {
        this.images = data.map((img) => ({
          src: `data:image/jpeg;base64,${img.blobData}`,
          alt: img.letra
        }));
      }
    );
  }
   
  cargarHistoriaPaciente(parametrourl:any){
    this.Service.getUnicoParams('GetHistoriaPaciente', parametrourl).subscribe(
      (data: Expediente) => {
        this.expediente={
          clave:data.clave,
          expediente1: this.formatTextForHtml(data.expediente1 || ""),
        }
      }
    );
  }

  

  formatTextForHtml(inputText: string): string {
    let escapedHtml = inputText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    // Envuelve el texto formateado en una etiqueta <pre>
    let formattedText = escapedHtml.replace(/\n/g, '<br>');
    return `<pre>${formattedText}</pre>`;
  }

  saveData(){
    if(!this.PacienteFormulario.invalid){
      this.Service.postData('PostPaciente',this.PacienteFormulario.value).subscribe(
        (result)=>{
         console.log(result);
        }
      )
    }
    
  }
}
