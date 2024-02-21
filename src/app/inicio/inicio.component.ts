import { Component, ElementRef } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { Paciente } from './../interface/Paciente';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'; 

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MenuComponent, SidebarComponent, HttpClientModule, CommonModule,MatTableModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})


export class InicioComponent  {
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();
  fechadenacimiento: Date | null;
  telefono: string;
  email: string | null;
  fecha_ultimaconsulta: string | null;
  constructor(private Service: Service) {}
  title = 'expedientes-medicos-cancun';
  contenido: string = '';
  fechaFormateada: string;
  nombre: string;
  edad: number;
  listaPacientes: Paciente[];
  displayedColumns: string[] = ['Clave', 'Nombre'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  ngOnInit() {
    this.fechaFormateada = `${this.dia < 10 ? '0' + this.dia : this.dia}/${
      this.mes < 10 ? '0' + this.mes : this.mes
    }/${this.año}`;
    this.cargarContenidoPacientePrincipal();
   
    this.cargarListadodePacientes();
   
  }

  cargarContenidoPacientePrincipal() {
    this.Service.getUnico('UsuarioMasactual').subscribe((data: Paciente) => {
      this.nombre = data.nombre;

      let anoNacimiento: Date = new Date(data.fechaDeNacimiento);
      this.edad = this.año - anoNacimiento.getFullYear();
      this.fecha_ultimaconsulta = data.fechaUltimaConsulta;
      this.telefono = data.telefono;
      this.email = data.email;
      
      console.log(this.edad + 'ssssssqwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
      // this.contenido=data[0].expediente
    });
  }

  cargarListadodePacientes() {
    this.Service.getList('GetPacientes').subscribe((data: Paciente[]) => {
     
      this.listaPacientes=data;
     console.log( this.listaPacientes + 'ssssssqwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'
      );
      // this.contenido=data[0].expediente
    });
  }
}
