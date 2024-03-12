import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-testeditor',
  standalone: true,
  imports: [CKEditorModule],
  templateUrl: './testeditor.component.html',
  styleUrl: './testeditor.component.css'
})
export class TesteditorComponent implements OnInit {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() data: string= '<p>Escribe algo aquí...</p>';; 

  constructor(private el: ElementRef) { }
  
  ngOnInit(): void {
    
  }


  saveText() {
    const textEditorContent = document.getElementById('text-editor')?.innerHTML;
    if (textEditorContent) {
     
      };
    }
  

  printDocument(): void {
    window.print();
  }
}
