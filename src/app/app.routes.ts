import { MenuComponent } from './components/menu/menu.component';
import { ExpedientePacienteComponent } from './expediente-paciente/expediente-paciente.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CanActivate } from '@angular/router';
import { AuthGuard } from './Services/AuthGuard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HistoriaConfiguracionComponent } from './historia-configuracion/historia-configuracion.component';

export const routes: Routes = [
    { 'path': 'login', component: LoginComponent },
    { 'path': 'register', component: RegisterComponent },
    { 'path': 'register', component: RegisterComponent },
    { 'path': 'resetPass', component: ResetPasswordComponent },
    { 'path': 'menu', component: MenuComponent },
    { 'path': 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
    { 'path': 'expediente_paciente/:id', component: ExpedientePacienteComponent,canActivate: [AuthGuard] },
    { 'path': 'configuracion_historias', component: HistoriaConfiguracionComponent, canActivate: [AuthGuard] }];
