import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Service } from '../Services/Service';
import { Plantilla } from '../interface/Plantilla';
import { UrlsBackend, UrlsPacientes, UrlsPlantillas } from '../enums/urls_back';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-plantillas-correos',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './plantillas-correos.component.html',
  styleUrl: './plantillas-correos.component.css',
})
export class PlantillasCorreosComponent implements OnInit {
  listadoPForm: any;
  agregarPForm: any;
  RelacionPlantillaPacienteForm: any;
  buscarPlantillaForm: any;
  mostrarPlantillaForm: any;
  showLoading: boolean = false;
  allPlantillas: Plantilla[] = [];
  plantillas: Plantilla[] = [];
  plantillaSelected: boolean = false;
  currentPlantillaId: any;
  pacientesActivos: any;
  pacientesInactivos: any;

  ngOnInit(): void {
    this.getPlantillas();
    this.cargarFormulario();
    this.getPacientes();
    console.log('this.getPlantillas()', this.getPlantillas());
    console.log('plantillas', this.plantillas);
    console.log('allPlantillas', this.allPlantillas);
  }

  constructor(private Service: Service) {}

  cargarFormulario() {
    this.agregarPForm = new FormGroup({
      name: new FormControl(''),
      fecha: new FormControl(''),
      asunto: new FormControl(''),
      cuerpo: new FormControl(''),
    });

    this.mostrarPlantillaForm = new FormGroup({
      idSelected: new FormControl(''),
      nameSelected: new FormControl(''),
      fechaSelected: new FormControl(''),
      asuntoSelected: new FormControl(''),
      cuerpoSelected: new FormControl(''),
    });

    this.buscarPlantillaForm = new FormGroup({
      buscarPlantilla: new FormControl(''),
    });

    this.buscarPlantillaForm
      .get('buscarPlantilla')
      .valueChanges.subscribe((val: string) => {
        this.filtrarPlantillas(val);
      });
  }

  getPlantillas() {
    this.showLoading = true;
    this.Service.GetData(
      UrlsBackend.ApiNotificacion,
      UrlsPlantillas.Get,
      ''
    ).subscribe({
      next: (result: Plantilla[]) => {
        console.log('getplan', result);
        this.allPlantillas = result;
        // this.allPlantillas = result.sort((a, b) =>
        //   a.Nombre.localeCompare(b.Nombre)
        // );
        this.plantillas = this.allPlantillas;
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {
        this.showLoading = false; // Finalizar carga
      },
    });
  }

  addNew() {
    this.showLoading = true;
    const plantillaNew: Plantilla = {
      id: 0,
      Nombre: this.agregarPForm.get('name')?.value,
      FechaEnvio: this.agregarPForm.get('fecha')?.value,
      Asunto: this.agregarPForm.get('asunto')?.value,
      CuerpoEmail: this.agregarPForm.get('cuerpo')?.value,
      Adjunto: '',
    };

    if (!this.agregarPForm.invalid) {
      console.log(this.agregarPForm.value);
      this.Service.PostData(
        UrlsBackend.ApiNotificacion,
        UrlsPlantillas.Post,
        plantillaNew
      ).subscribe((result) => {
        this.agregarPForm.patchValue({
          name: '',
          fecha: '',
          asunto: '',
          cuerpo: '',
        });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha agregado una nueva plantilla de correo',
          showConfirmButton: false,
          timer: 2000,
        });
        this.getPlantillas();
        console.log(result);
      });
    }
  }

  getPacientes() {
    this.Service.GetData(
      UrlsBackend.ApiPacientes,
      UrlsPacientes.GetPacientesNotificaciones,
      ''
    ).subscribe({
      next: (result: Plantilla[]) => {
        console.log('pacientestodos', result);
        this.pacientesActivos = result.filter(x => x == "pacientesActivos");
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {},
    });
  }

  filtrarPlantillas(buscarTexto: string) {
    if (!buscarTexto) {
      this.plantillas = this.allPlantillas; // Si no hay texto de búsqueda, muestra todos los tratamientos
    } else {
      this.plantillas = this.allPlantillas.filter((p) =>
        p.Nombre.toLowerCase().includes(buscarTexto.toLowerCase())
      );
    }
  }

  viewDetails(plantSelected: any) {
    console.log('plantSelected', plantSelected);
    const fecha = new Date(plantSelected.fechaEnvio);
    const formattedDate = fecha.toISOString().substring(0, 10); // Corta el string para obtener solo la fecha

    this.plantillaSelected = true;
    this.mostrarPlantillaForm.patchValue({
      idSelected: plantSelected.id,
      nameSelected: plantSelected.nombre,
      fechaSelected: formattedDate,
      asuntoSelected: plantSelected.asunto,
      cuerpoSelected: plantSelected.cuerpoEmail,
    });
    this.currentPlantillaId =
      this.mostrarPlantillaForm.get('idSelected')?.value;
    console.log('currentPlantillaId ID', this.currentPlantillaId);
  }

  update() {
    this.showLoading = true;
    const plantillaEdit: Plantilla = {
      id: this.mostrarPlantillaForm.get('idSelected')?.value,
      Nombre: this.mostrarPlantillaForm.get('nameSelected')?.value,
      FechaEnvio: this.mostrarPlantillaForm.get('fechaSelected')?.value,
      Asunto: this.mostrarPlantillaForm.get('asuntoSelected')?.value,
      CuerpoEmail: this.mostrarPlantillaForm.get('cuerpoSelected')?.value,
      Adjunto: '',
    };
    this.Service.PostData(
      UrlsBackend.ApiNotificacion,
      UrlsPlantillas.Post,
      plantillaEdit
    ).subscribe({
      next: (response) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha editado la plantilla',
          showConfirmButton: false,
          timer: 2000,
        });
        this.cleanFormMostrarPlantilla();
        this.getPlantillas();
        this.plantillaSelected = false;
      },
      error: (error) => {
        this.cleanFormMostrarPlantilla();
        this.plantillaSelected = false;
        this.showLoading = false;
      },
    });
  }

  delete() {
    this.showLoading = true;
    const id = this.mostrarPlantillaForm.get('idSelected')?.value;
    Swal.fire({
      title: 'Seguro desea eliminar esta plantilla?',
      text:
        'Se eliminará la plantilla ' +
        this.mostrarPlantillaForm.get('nameSelected')?.value,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.Delete(
          UrlsBackend.ApiNotificacion,
          UrlsPlantillas.Delete,
          id
        ).subscribe({
          next: (response) => {
            this.cleanFormMostrarPlantilla();
            this.getPlantillas();
            this.plantillaSelected = false;
          },
          error: (error) => {
            this.cleanFormMostrarPlantilla();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error al eliminar la plantilla',
              // footer: '<a href="#">Why do I have this issue?</a>'
            });
            this.plantillaSelected = false;
            this.showLoading = false;
          },
        });
        Swal.fire({
          title: 'Eliminado!',
          text: 'La plantilla ha sido eliminado.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  cleanFormMostrarPlantilla() {
    this.mostrarPlantillaForm.patchValue({
      idSelected: '',
      nameSelected: '',
      fechaSelected: '',
      asuntoSelected: '',
      cuerpoSelected: '',
    });
  }
}
