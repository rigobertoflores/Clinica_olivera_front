import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,FormsModule  } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { error } from 'jquery';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  formReg: FormGroup;


  constructor(private userService: UserService, private router: Router) {
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),

    });
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.formReg.value);
    this.userService
      .register(this.formReg.value)
      .then((response) => {
        console.log(response);
        this.router.navigate(['/login'])
      })
      .catch((error) => console.log(error));
  }
}
