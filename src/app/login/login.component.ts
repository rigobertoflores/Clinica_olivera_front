import { Component } from '@angular/core';
import { FormControl,ReactiveFormsModule  } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterOutlet ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email= new FormControl('');
  password=new FormControl('');

  constructor() { }

  login() {
    console.log('Login', this.email, this.password);
    // Aquí implementarías la lógica de autenticación
  }
}
