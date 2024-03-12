import { Component } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './../Services/user.service';
import { login } from '../interface/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  
  userService: any;
  loginform: any;

  // formLog: FormGroup;
  

  constructor(private authService: UserService,private router: Router) {}

  // login() {
  //   console.log('Login', this.email, this.password);
  //   // Aquí implementarías la lógica de autenticación
  // }

  // constructor(private userService: UserService, private router: Router) {
  //   this.formLog = new FormGroup({
  //     email: new FormControl(),
  //     password: new FormControl(),

  //   });
  // }

  ngOnInit(): void {
  this.cargarFormulario();
  }

  cargarFormulario() {
    this.loginform = new FormGroup({
      email: new FormControl(''),
      pass:new FormControl('')
    });
  }

  // login() {
  //   this.authService.login().subscribe({
  //     next: (result) => {
  //       console.log('Login successful', result);
  //       // Handle successful login
  //     },
  //     error: (error) => {
  //       console.error('Login failed', error);
  //       // Handle login error
  //     },
  //   });
  // }

  // onSubmit() {
  //   console.log(this.formLog.value);
  //   this.userService
  //     .login(this.formLog.value)
  //     .then((response) => {
  //       console.log(response);
  //       this.router.navigate(['/inicio'])
  //     })
  //     .catch((error) => console.log(error));
  // }

  onClickGoogle() {
    this.authService.loginWithGoogle()
      .then((response: any) => {
        console.log("Respuesta login con google",response);
        this.router.navigate(['/inicio']);
      })
      .catch((error: any) => console.log("Error en login con google",error));
  }
}
