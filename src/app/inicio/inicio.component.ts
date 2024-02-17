import { Component } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MenuComponent,SidebarComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
