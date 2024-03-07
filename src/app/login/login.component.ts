import { Component } from '@angular/core';
import { FormControl,FormGroup,ReactiveFormsModule  } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterOutlet ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLog: FormGroup;
  email= new FormControl('');
  password=new FormControl('');

  // constructor() { }

  login() {
    console.log('Login', this.email, this.password);
    // Aquí implementarías la lógica de autenticación
  }

  constructor(private userService: UserService, private router: Router) {
    this.formLog = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),

    });
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.formLog.value);
    this.userService
      .login(this.formLog.value)
      .then((response) => {
        console.log(response);
        this.router.navigate(['/inicio'])
      })
      .catch((error) => console.log(error));
  }
  onClickGoogle(){
this.userService.loginWithGoogle()
.then((response) => {
  console.log(response);
  this.router.navigate(['/inicio'])
})
.catch((error) => console.log(error));

  }

}
