import { Component } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Service } from '../Services/Service';
import { Tratamiento } from '../interface/Tratamiento';
import { MatList } from '@angular/material/list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,
    ReactiveFormsModule,
    MatList,
    CommonModule,
  ],
  templateUrl: './tratamientos.component.html',
  styleUrl: './tratamientos.component.css',
})
export class TratamientosComponent {
  tratamientosForm: any;
  mostrarTratamientosForm: any;
  treatments: Tratamiento;
  currentTreatmentId: string | null = null;

  constructor(private Service: Service) {}

  ngOnInit(): void {
    this.cargarFormulario();
    this.getTreatments();
    console.log(this.getTreatments());
  }

  cargarFormulario() {
    this.tratamientosForm = new FormGroup({
      name: new FormControl(''),
      words: new FormControl(''),
      description: new FormControl(''),
      treatments: new FormControl(''),
    });
    this.mostrarTratamientosForm = new FormGroup({
      nameV: new FormControl(''),
      idV: new FormControl(''),
      wordsV: new FormControl(''),
      descriptionV: new FormControl(''),
      treatmentsV: new FormControl(''),
    });
  }

  addNew() {
    const treatments: Tratamiento = {
      id: 0,
      nombre: this.tratamientosForm.get('name')?.value,
      descripcionEnfermedad: this.tratamientosForm.get('description')?.value,
      tratamiento: this.tratamientosForm.get('treatments')?.value,
      palabrasClaves: this.tratamientosForm.get('words')?.value,
    };

    if (!this.tratamientosForm.invalid) {
      console.log(this.tratamientosForm.value);
      this.Service.InsertTratamiento(
        'PostInsertTratamientos',
        treatments
      ).subscribe((result) => {
        this.tratamientosForm.patchValue({
          name: '',
          description: '',
          treatments: '',
          words: '',
        });
        // Mostrar mensaje de exito
        console.log(result);
      });
    }
  }



  getTreatments() {
    this.Service.GetTratamiento().subscribe((result) => {
      this.treatments = result.sort(
        (a: { nombre: string }, b: { nombre: any }) =>
          a.nombre.localeCompare(b.nombre)
      );
      console.log('Todos los tratamientos', result);
    });
  }

  viewDetails(tratamientoSelected: any) {
    console.log("tratamientoSelected", tratamientoSelected);
    this.mostrarTratamientosForm.patchValue({
      idV:  tratamientoSelected.id,
      nameV: tratamientoSelected.nombre,
      wordsV: tratamientoSelected.palabrasClaves,
      descriptionV: tratamientoSelected.descripcionEnfermedad,
      treatmentsV: tratamientoSelected.tratamiento,
    });
    this.currentTreatmentId = this.mostrarTratamientosForm.get('idV')?.value;
    console.log("tratamientoSelected ID", this.currentTreatmentId);
  }

  update() {
    // const tratamiento = this.mostrarTratamientosForm.value;

    const treatmentsEdit: Tratamiento = 
    {
      id: this.mostrarTratamientosForm.get('idV')?.value,
      nombre: this.mostrarTratamientosForm.get('nameV')?.value,
      descripcionEnfermedad: this.mostrarTratamientosForm.get('descriptionV')?.value,
      tratamiento: this.mostrarTratamientosForm.get('treatmentsV')?.value,
      palabrasClaves: this.mostrarTratamientosForm.get('wordsV')?.value,
    }
       this.Service.EditTratamiento(treatmentsEdit).subscribe({
      next: (response) => {
             //Mostrarmensaje 
             this.cleanFormmMostrarTratamientos();
             this.getTreatments();

             
      },
      error: (error) => {
        // Manejar error
        this.cleanFormmMostrarTratamientos();
      }
    });
  }

  delete() {    
    const id = this.mostrarTratamientosForm.get('idV')?.value;
    this.Service.DeleteTratamiento(id).subscribe({
      next: (response) => {
        //Mostrarmensaje 
        this.cleanFormmMostrarTratamientos();
        this.getTreatments();
      },
      error: (error) => {
        // Manejar error
        this.cleanFormmMostrarTratamientos();
        //Mostrar mensaje
      }
    });
  }

cleanFormmMostrarTratamientos(){
  this.mostrarTratamientosForm.patchValue({
    nameV: '',
    idV: '',
    wordsV: '',
    descriptionV: '',
    treatmentsV: '',
  });
}

}
