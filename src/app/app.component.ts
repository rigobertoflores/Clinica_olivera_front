import { Service } from './Service';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Importa EditorModule
import { EditorModule } from '@tinymce/tinymce-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import {Paciente} from './app.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorModule],
  styleUrl: './app.component.css',
  template: `
    <editor
      [init]="{
        height: 500,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
      }"
    ></editor>
  `
})

export class AppComponent {
  constructor(private Service: Service) { }
  title = 'expedientes-medicos-cancun';
  contenido: string = '';

  // constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log("sssssssssssssswq11111111111111111111111111111111111qqqqqqqq1111111111");
      this.cargarContenido();
  }

  cargarContenido() {
   this.Service.getTexto().subscribe(data => {
    console.log(data[0].expediente,"ssssssqwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    this.contenido=data[0].expediente
  });
  }
}
