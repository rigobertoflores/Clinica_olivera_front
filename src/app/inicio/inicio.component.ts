import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { Paciente } from './../interface/Paciente';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent  implements OnInit,AfterViewInit {
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();
  fechadenacimiento: Date | null;
  telefono: string;
  email: string | null;
  fecha_ultimaconsulta: string | null;
  dataSource= new MatTableDataSource<Paciente>();
  title = 'expedientes-medicos-cancun';
  contenido: string = '';
  fechaFormateada: string;
  nombre: string;
  edad: number;
  listaPacientes: Paciente[];
  displayedColumns: string[] = ['Nombre', 'sexo'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private Service: Service,private _liveAnnouncer: LiveAnnouncer) {}

  ngOnInit() {
   this.formatearfecha();
    this.cargarContenidoPacientePrincipal(); 
    
  }

  ngAfterViewInit() {
    this.cargarListadodePacientes();
    
  }

  formatearfecha(){
    this.fechaFormateada = `${this.dia < 10 ? '0' + this.dia : this.dia}/${
      this.mes < 10 ? '0' + this.mes : this.mes
    }/${this.año}`;
  }

  cargarContenidoPacientePrincipal() {
    this.Service.getUnico('UsuarioMasactual').subscribe((data: Paciente) => {
      this.nombre = data.nombre;

      let anoNacimiento: Date = new Date(data.fechaDeNacimiento);
      this.edad = this.año - anoNacimiento.getFullYear();
      this.fecha_ultimaconsulta = data.fechaUltimaConsulta;
      this.telefono = data.telefono;
      this.email = data.email;
    });
  }

  cargarListadodePacientes() {
    this.Service.getList('GetPacientes').subscribe((data: Paciente[]) => {
      this.dataSource = new MatTableDataSource<Paciente>(data);
      this.dataSource.paginator = this.paginator;
    });
  }
  

  
}
