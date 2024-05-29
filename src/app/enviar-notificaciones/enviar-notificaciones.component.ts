import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-enviar-notificaciones',
  standalone: true,
  imports: [MenuComponent, SidebarComponent],
  templateUrl: './enviar-notificaciones.component.html',
  styleUrl: './enviar-notificaciones.component.css',
})
export class EnviarNotificacionesComponent implements OnInit {
  filteredOptions: any[];
  options: any[] = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
    { value: 'option3', label: 'Opción 3' },
    // Agrega más opciones según sea necesario
  ];

  ngOnInit(): void {
    this.filteredOptions = this.options;
  }

  selectOption(value: any) { }

}
