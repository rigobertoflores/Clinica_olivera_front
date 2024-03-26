import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user : string;
  email: string;
  

  constructor(private authService: UserService,private router: Router) {
    if (this.authService.isAuthenticated()){     
      const userJson = localStorage.getItem('user');
      if(userJson){
    this.user = JSON.parse(userJson).email.split('@')[0] ;  
    this.email = JSON.parse(userJson).email ;  
  }
    }

  }

   changePass(){
  this.router.navigate(['/changePass']); 
  }


}
