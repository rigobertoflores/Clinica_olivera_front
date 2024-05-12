import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-plantillas-correos',
  standalone: true,
  imports: [MenuComponent, SidebarComponent, ReactiveFormsModule],
  templateUrl: './plantillas-correos.component.html',
  styleUrl: './plantillas-correos.component.css',
})
export class PlantillasCorreosComponent implements OnInit {
  listadoPForm: any;
  agregarPForm: any;
  RelacionPlantillaPacienteForm: any;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  addNew() { }
  
  getPacientes() { 

    
  }
}
