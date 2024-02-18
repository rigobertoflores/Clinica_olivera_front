import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Importa EditorModule
import { EditorModule } from '@tinymce/tinymce-angular';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    // Añade EditorModule a tu lista de imports
    EditorModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
