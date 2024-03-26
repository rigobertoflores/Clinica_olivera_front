import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-pass',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,ReactiveFormsModule
  ],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.css'
})
export class ChangePassComponent {
 changeForm: any;
 pass: string;
 confirmPass: string;


 constructor(private authService: UserService,private router: Router, private route: ActivatedRoute) {}
 
 ngOnInit(): void {

 this.cargarFormulario();

 }

 cargarFormulario() {
   this.changeForm = new FormGroup({
    pass: new FormControl(''),
     confirmPass:new FormControl('')
   });
 }


  async  changePass(){
if(this.pass !== this.confirmPass){
console.log("No coinciden las contraseñas");
}
    try {
      await this.authService.changePassword(this.pass);
      this.changeForm.get('pass').setValue('');
      this.changeForm.get('confirmPass').setValue('');
      // Mostrar mensaje
    console.log("Contraseña cambiada con éxito");
      this.pass = '';
    } catch (error) {
      
    }
  
    }

    navigateTo(){      
        this.router.navigate(['/profile']); 
     
    }
}
