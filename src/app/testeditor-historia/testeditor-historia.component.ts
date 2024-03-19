import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-testeditor-historia',
  standalone: true,
  imports: [CKEditorModule,FormsModule ],
  templateUrl: './testeditor-historia.component.html',
  styleUrl: './testeditor-historia.component.css'
})
export class TesteditorHistoriaComponent {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() data: string= '';

}
