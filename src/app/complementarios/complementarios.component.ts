import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuComponent } from "../components/menu/menu.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Service } from './../Services/Service';
import { catchError, finalize, of } from 'rxjs';
import { Complementos } from '../interface/Complementos';
import { StandaloneGalleryComponent } from '../standalone-gallery/standalone-gallery.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-complementarios',
    standalone: true,
    templateUrl: './complementarios.component.html',
    styleUrl: './complementarios.component.css',
    imports: [MenuComponent, SidebarComponent]
})
export class ComplementariosComponent implements OnInit {
    selectedFile: any;
    parametro: any;
    documentos: { src: string; alt: string; }[];
    
    constructor(private route: ActivatedRoute,private Service: Service,private cd: ChangeDetectorRef,public dialog: MatDialog){}

    ngOnInit(): void {
        this.parametro = this.route.snapshot.paramMap.get('id');
    }
    
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
    
        if (input.files && input.files[0]) {
          this.selectedFile = input.files[0] as File; // Afirmación de tipo aquí
        }
    }
      
  upload(): void {
    this.cd.detectChanges();  // Forzar la detección de cambios aquí

    if (!this.selectedFile) {
      // Use SweetAlert2 to display the alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona un archivo primero.'
      }).then(() => {
        this.cd.detectChanges();  // Forzar la detección de cambios después de actualizar showLoading
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    formData.append('id', this.parametro || '');

    this.Service.postData('PostPdf', formData)
      .pipe(
        finalize(() => {
          this.cd.detectChanges();  // Forzar la detección de cambios en finalize
        }),
        catchError((error) => {
          console.error('Error uploading image:', error);
          return of([]);  // Maneja el error y continúa el flujo
        })
      )
      .subscribe(
        (data: Complementos[]) => {
          this.documentos = data.map((documento) => ({
            src: `data:image/jpeg;base64,${documento.blobData}`,
            alt: documento.nombre
          }));
          this.cd.detectChanges();  
        }
      );
  }

  openDialog(imageUrl: string): void {
    this.dialog.open(StandaloneGalleryComponent, {
      data: {
        documento: imageUrl
      },
      panelClass: 'custom-dialog-container' 
    });
  }


}
