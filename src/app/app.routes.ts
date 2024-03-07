import { MenuComponent } from './components/menu/menu.component';
import { ExpedientePacienteComponent } from './expediente-paciente/expediente-paciente.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { 'path': 'login', component: LoginComponent },
    { 'path': 'register', component: RegisterComponent },
    { 'path': 'menu', component: MenuComponent },
    { 'path': 'inicio', component: InicioComponent },
    { 'path': 'expediente_paciente/:id', component: ExpedientePacienteComponent }];
