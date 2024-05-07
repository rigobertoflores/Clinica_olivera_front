import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { OpcionesSidebar } from '../../enums/sidebar';
import { Utils } from '../../Utils/utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  user: string;
  routing: any;
  userAdmin: string = 'admin';
  imagendefault: string = 'assets/user.png';
  imagenPerfilUrl: string | null;
  opcionesSB: typeof OpcionesSidebar;

  constructor(private authService: UserService, private router: Router) {
    this.routing = Utils;
    if (this.authService.isAuthenticated()) {
      const userJson = localStorage.getItem('user');
      console.log(this.authService, '1');
      if (userJson) {
        this.user = JSON.parse(userJson).email.split('@')[0];
        console.log('user logado', this.user);
      }
    }
  }

  async ngOnInit() {
    this.imagenPerfilUrl = await this.authService.obtenerImagenPerfil();
    console.log(
      'this.imagenPerfilUrl',
      this.imagenPerfilUrl,
      localStorage.getItem('photoURL')
    );
    this.opcionesSB = OpcionesSidebar;
  }

  navigateTo(option: OpcionesSidebar): void {
    const route = this.routing.getRouteForOption(option);
    if (route) {
      if (route == '/expediente_paciente') this.router.navigate([route, 0]);
      else this.router.navigate([route]);
    } else {
      console.error('Ruta no definida para la opción:', option);
    }
  }
}
