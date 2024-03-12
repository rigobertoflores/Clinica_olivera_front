import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';


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
}
