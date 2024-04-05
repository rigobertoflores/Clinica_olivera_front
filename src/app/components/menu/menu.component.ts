import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { OpcionesSidebar } from '../../enums/sidebar';


@Component({
  selector: 'app-menu',
  standalone: true,
  template: `
    <button mat-icon-button (click)="logout()">
      <mat-icon>logout</mat-icon>
    </button>
  `,
  imports: [
    MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  opcionesSB = OpcionesSidebar;

  constructor(
    private authService: UserService,
    private router: Router,    
  ) {}
  


  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); 
      },
      error: (error) => console.error('Logout failed', error),
    });
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
      [OpcionesSidebar.AgregarPaciente]: ''
    };

    return routesMap[option] || null;
  }
}
