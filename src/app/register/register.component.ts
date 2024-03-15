import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { error } from 'jquery';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  userService: any;
  registerform: any;


  constructor(private authService: UserService,private router: Router) {}

  ngOnInit(): void {
    this.cargarFormulario();
    }
  
    cargarFormulario() {
      this.registerform = new FormGroup({
        email: new FormControl(''),
        password:new FormControl(''),
        repeatPassword: new FormControl('')
      });
    }
 
 
  registerUser(){    
    let pass : string = this.registerform.get('password')?.value;
    let repeatPass : string = this.registerform.get('repeatPassword')?.value;
        if(pass === repeatPass){
      this.authService.register(
        this.registerform.get('email')?.value, this.registerform.get('password')?.value
      ).then(() => {
        console.log('Registro exitoso');
        this.router.navigate(['/login']);
      }).catch(error => {
        console.error('Error en el registro:', error);
        // Manejo de errores de registro
      });
  }else {
    console.error('Contraseñas no coinciden:', error);
  }
}

  regresaAlogin(){
    this.router.navigate(['/login']);
  }
}
