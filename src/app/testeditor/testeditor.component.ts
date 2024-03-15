import { Component, ElementRef, EventEmitter, Input, OnInit, Output,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-testeditor',
  standalone: true,
  imports: [CKEditorModule,FormsModule ],
  templateUrl: './testeditor.component.html',
  styleUrl: './testeditor.component.css'
})
export class TesteditorComponent implements OnInit {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() data: string= '<p>Escribe algo aquí...</p>';
  @Output() datosDisponibles = new EventEmitter<any>();
  public model = {
    editorData: '<p>Hello, world!</p>'
};

  constructor(private el: ElementRef) { }
  
  ngOnInit(): void {
    
  }

  saveText() {    
    const datos =this.data;
     this.datosDisponibles.emit(datos);      
    }
  

  printDocument(): void {
    window.print();
  }
}
