import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Service } from '../Services/Service';
import {
  NotificacionPacientes,
  PacientesPlantillas,
  Plantilla,
} from '../interface/Plantilla';
import { UrlsBackend, UrlsPacientes, UrlsPlantillas } from '../enums/urls_back';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import {
  AsociacionPlantillaPaciente,
  RelacionPlantilllaPaciente,
} from '../interface/PlantillasPacientes';
import { firstValueFrom } from 'rxjs';

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
export class PlantillasCorreosComponent implements OnInit, OnDestroy {
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
  modalAgregarPacientes: boolean = false;
  allPacientes: any;
  headerPacientes: any;
  iconoHeaderPacientes: any;
  pacientesAInsertar: Array<NotificacionPacientes> =
    new Array<NotificacionPacientes>();
  pacientesVinculados: any = [];
  pacientesADesvincular: NotificacionPacientes[] = [];

  ngOnInit(): void {
    this.getPlantillas();
    this.cargarFormulario();
    this.getPacientes();
    console.log('this.getPlantillas()', this.getPlantillas());
    console.log('plantillas', this.plantillas);
    console.log('allPlantillas', this.allPlantillas);
    this.updateAllPacientes(
      this.RelacionPlantillaPacienteForm.get('pacientesTipo').value
    );
  }

  constructor(private Service: Service) {}
  ngOnDestroy(): void {
    this.pacientesADesvincular = [];
    this.pacientesAInsertar = [];
  }

  cargarFormulario() {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    this.agregarPForm = new FormGroup({
      name: new FormControl(''),
      fecha: new FormControl(formattedDate),
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

    // this.buscarPlantillaForm
    //   .get('buscarPlantilla')
    //   .valueChanges.subscribe((val: string) => {
    //     this.filtrarPlantillas(val);
    //   });

    this.RelacionPlantillaPacienteForm = new FormGroup({
      idPlantPac: new FormControl(''),
      asuntoPlantPac: new FormControl(''),
      fechaPlantPac: new FormControl(''),
      cuerpoPlantPac: new FormControl(''),
      pacientesTipo: new FormControl('activos'),
    });
    this.RelacionPlantillaPacienteForm.get(
      'pacientesTipo'
    ).valueChanges.subscribe((value: string) => {
      this.updateAllPacientes(value);
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
      next: (result: PacientesPlantillas) => {
        console.log('pacientestodos', result);
        this.pacientesActivos = result.pacientesActivos;
        this.pacientesInactivos = result.pacientesInactivos;
        console.log('this.pacientesActivos', this.pacientesActivos);
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {},
    });
  }

  getPacientesVinculados(plantillaId: any) {
    this.Service.GetData(
      UrlsBackend.ApiNotificacion,
      `${UrlsPlantillas.GetPacientesVinculadosPP}/${plantillaId}`,
      plantillaId
    ).subscribe({
      next: (result: any) => {
        console.log('pacientesVinculados', result);
        this.pacientesVinculados = result;
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
    this.modalAgregarPacientes = false;
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

  cleanMostrarAgregarPacientes() {
    this.mostrarPlantillaForm.patchValue({
      idPlantPac: '',
      fechaPlantPac: '',
      asuntoPlantPac: '',
      cuerpoPlantPac: '',
    });
  }
  mostrarAgregarPacientes(plantilla: any) {
    this.plantillaSelected = false;
    this.modalAgregarPacientes = true;
    this.cleanMostrarAgregarPacientes();
    const fecha = new Date(plantilla.fechaEnvio);
    const formattedDate = fecha.toISOString().substring(0, 10);
    this.RelacionPlantillaPacienteForm.patchValue({
      idPlantPac: plantilla.id,
      fechaPlantPac: formattedDate,
      asuntoPlantPac: plantilla.asunto,
      cuerpoPlantPac: plantilla.cuerpoEmail,
    });
    this.getPacientesVinculados(
      parseInt(this.RelacionPlantillaPacienteForm.get('idPlantPac').value)
    );
    const pacientesTipo =
      this.RelacionPlantillaPacienteForm.get('pacientesTipo').value;
    this.updateAllPacientes(pacientesTipo);
  }

  updateAllPacientes(pacientesTipo: string) {
    if (pacientesTipo === 'activos') {
      this.allPacientes = this.pacientesActivos;
      this.headerPacientes = 'Pacientes Activos';
      this.iconoHeaderPacientes = 'fa-solid fa-users-rectangle';
    } else {
      this.allPacientes = this.pacientesInactivos;
      this.headerPacientes = 'Pacientes Inactivos';
      this.iconoHeaderPacientes = 'fa-solid fa-users-slash';
    }
  }

  agregarPaciente(paciente: any) {
    console.log('pacienteaAgregar', paciente);
    if (
      this.pacientesVinculados.filter(
        (x: { [x: string]: any }) => x['pacienteId'] == paciente.id
      ).length == 0
    ) {
      this.pacientesAInsertar.push(paciente);
      const temp = {
        pacienteId: paciente.id,
        email: '',
        fechaConsulta: '',
        nombrePaciente: paciente.nombre,
      };

      this.pacientesVinculados[this.pacientesVinculados.length] = temp;
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Este paciente ya está vinculado a la plantilla actual',
        showConfirmButton: false,
        timer: 2000,
      });
    }
    console.log('this.pacientesAInsertar', this.pacientesAInsertar);
    console.log('this.pacientesVinculados', this.pacientesVinculados);
    // enviar al backend
  }

  devincularPaciente(paciente: NotificacionPacientes) {
    this.pacientesADesvincular[this.pacientesADesvincular.length] = paciente;
    console.log('this.pacientesADesvincular', this.pacientesADesvincular);
    const index = this.pacientesVinculados.findIndex(
      (pac: { id: any }) => paciente.id === pac.id
    );
    if (index !== -1) {
      this.pacientesVinculados.splice(index, 1);
    }
  }

  // guardarnuevosVinculos() {
  //   this.showLoading = true;
  //      if (this.pacientesAInsertar.length > 0) {
  //     let dataInsertar: RelacionPlantilllaPaciente[] = this.pacientesAInsertar.map(
  //       (paciente) => {
  //         return {
  //           id: 0,
  //           plantillaId: parseInt(
  //             this.RelacionPlantillaPacienteForm.get('idPlantPac').value
  //           ),
  //           pacienteId: parseInt(paciente.id),
  //           nombrePlantilla:
  //             this.RelacionPlantillaPacienteForm.get(
  //               'asuntoPlantPac'
  //             ).value.toString(),
  //           nombrePaciente: paciente.nombre.toString(),
  //           status: '',
  //           fechaCreacion: new Date(),
  //           fechaUltActualizacion: new Date(),
  //         };
  //       }
  //     );
  //     //       const formData = new FormData();
  //     // formData.append('pacientesAgregar', JSON.stringify(dataInsertar));
  //     // formData.append(
  //     //   'pacientesEliminar',
  //     //   JSON.stringify(this.pacientesADesvincular)
  //     // );
  //     this.Service.PostData(
  //       UrlsBackend.ApiNotificacion,
  //       UrlsPlantillas.PostAgregarVinculo,
  //       dataInsertar
  //     ).subscribe((result) => {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: 'Se han guardado los cambios correctamente',
  //         showConfirmButton: false,
  //         timer: 2000,
  //       });
  //       this.getPacientesVinculados(
  //         parseInt(this.RelacionPlantillaPacienteForm.get('idPlantPac').value)
  //       );
  //       console.log(result);
  //     });
  //   }

  //    if (this.pacientesADesvincular.length > 0) {

  //      this.Service.PostData(
  //        UrlsBackend.ApiNotificacion,
  //        UrlsPlantillas.DeleteEliminarVinculo,
  //        this.pacientesADesvincular
  //      ).subscribe((result) => {
  //        Swal.fire({
  //          position: 'center',
  //          icon: 'success',
  //          title: 'Se han guardado los cambios correctamente',
  //          showConfirmButton: false,
  //          timer: 2000,
  //        });
  //        this.getPacientesVinculados(
  //          parseInt(this.RelacionPlantillaPacienteForm.get('idPlantPac').value)
  //        );
  //        console.log(result);
  //      });
  //    }
  //   this.pacientesADesvincular = [];
  //   this.pacientesAInsertar = [];
  //     this.showLoading = true;
  // }

async guardarnuevosVinculos() {
  this.showLoading = true;

  try {
    const promises = [];

    if (this.pacientesAInsertar.length > 0) {
      const dataInsertar: RelacionPlantilllaPaciente[] = this.pacientesAInsertar.map(
        (paciente) => {
          return {
            id: 0,
            plantillaId: parseInt(this.RelacionPlantillaPacienteForm.get('idPlantPac').value),
            pacienteId: parseInt(paciente.id),
            nombrePlantilla: this.RelacionPlantillaPacienteForm.get('asuntoPlantPac').value.toString(),
            nombrePaciente: paciente.nombre.toString(),
            status: '',
            fechaCreacion: new Date(),
            fechaUltActualizacion: new Date(),
          };
        }
      );
      console.log('this.pacientesAInsertar', this.pacientesAInsertar);

      promises.push(
        firstValueFrom(this.Service.PostData(UrlsBackend.ApiNotificacion, UrlsPlantillas.PostAgregarVinculo, dataInsertar))
      );
    }

    if (this.pacientesADesvincular.length > 0) {
      console.log('pacientesADesvincular', this.pacientesADesvincular);
      const idsElimanr: string[] = this.pacientesADesvincular.map(pd => pd.id); 
      promises.push(
        firstValueFrom(
          this.Service.Delete(
            UrlsBackend.ApiNotificacion,
            UrlsPlantillas.DeleteEliminarVinculo,
            idsElimanr           
          )
        )
      );
    }

    await Promise.all(promises);

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Se han guardado los cambios correctamente',
      showConfirmButton: false,
      timer: 2000,
    });

    // Limpiar las listas después de completar todas las operaciones
    this.pacientesADesvincular = [];
    this.pacientesAInsertar = [];
    this.showLoading = false;

    // Recargar los pacientes vinculados
    this.getPacientesVinculados(parseInt(this.RelacionPlantillaPacienteForm.get('idPlantPac').value));
  } catch (error) {
    // Manejar errores si es necesario
    console.error('Error:', error);
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Se produjo un error al guardar los cambios',
      showConfirmButton: true,
    });
    this.showLoading = false;
    this.pacientesADesvincular = [];
    this.pacientesAInsertar = [];
  }
}

}
