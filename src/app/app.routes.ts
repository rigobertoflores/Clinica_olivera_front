import { MenuComponent } from './components/menu/menu.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { 'path': 'login', component: LoginComponent },
    { 'path': 'menu', component: MenuComponent },
    { 'path': 'inicio', component: InicioComponent },];
