import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import  {OpcionesSidebar} from '../../enums/sidebar'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
user : string;
opcionesSB = OpcionesSidebar;
imagenPerfilUrl: string  | null;

  constructor(private authService: UserService,private router: Router) {
    if (this.authService.isAuthenticated()){     
      const userJson = localStorage.getItem('user');
      console.log(this.authService, "1");
      if(userJson){
    this.user = JSON.parse(userJson).email.split('@')[0] ;
    console.log("user logado", this.user)
  }
    }

  }

  async ngOnInit() {
    this.imagenPerfilUrl = await this.authService.obtenerImagenPerfil();
    console.log("this.imagenPerfilUrl", this.imagenPerfilUrl);
  }
 


  navigateTo(option: OpcionesSidebar): void {
    const route = this.getRouteForOption(option);
    if (route) {
      this.router.navigate([route]);
    } else {
      console.error('Ruta no definida para la opción:', option);
    }
  }

  private getRouteForOption(option: OpcionesSidebar): string | null {
    const routesMap: Record<OpcionesSidebar, string> = {
      [OpcionesSidebar.Home]: '/inicio',
      [OpcionesSidebar.Profile]: '/profile',
      [OpcionesSidebar.Tratamientos]: '/tratamientos',
     
    };

    return routesMap[option] || null;
  }



}
