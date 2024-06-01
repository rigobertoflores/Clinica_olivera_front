import { ApplicationConfig, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren,ChangeDetectorRef } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../Services/Service';
import { Paciente } from '../interface/Paciente';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StandaloneGalleryComponent } from '../standalone-gallery/standalone-gallery.component';
import { MatDialog } from '@angular/material/dialog';
import { ImagenPaciente } from '../interface/ImagenPaciente';
import { TesteditorComponent } from "../testeditor/testeditor.component";
import { Expediente } from '../interface/Expediente';
import { RecetaxPaciente } from '../interface/RecetaxPaciente';
import { event } from 'jquery';
import { TesteditorHistoriaComponent } from "../testeditor-historia/testeditor-historia.component";
import { NotasComponent } from '../notas/notas.component';
import { nota } from '../interface/nota';
import { FotoPaciente } from '../interface/FotoPaciente';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { provideLottieOptions } from 'ngx-lottie';
import { TesteditorinformesoComponent } from '../testeditorinformeso/testeditorinformeso.component';
import { LoadingComponent } from '../loading/loading.component';
import { catchError, finalize, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ComplementariosComponent } from "../complementarios/complementarios.component";

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],
};


@Component({
    selector: 'app-expediente-paciente',
    standalone: true,
    templateUrl: './expediente-paciente.component.html',
    styleUrl: './expediente-paciente.component.css',
    imports: [MenuComponent, SidebarComponent, ReactiveFormsModule, CommonModule, StandaloneGalleryComponent, TesteditorComponent, TesteditorHistoriaComponent, NotasComponent, LoadingComponent, LottieComponent, TesteditorinformesoComponent, ComplementariosComponent]
   })

export class ExpedientePacienteComponent implements OnInit {
 
  parametro: string | null = null;
  pacientedatos: Paciente;
  PacienteFormulario: FormGroup;
  images: { src: string; alt: string; id:number }[];
  imagenperfil: { src: string };
  imagenesPaciente: ImagenPaciente[];
  expediente: Expediente;
  historia: string;
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();
  fechaFormateada: string;
  @ViewChild(TesteditorComponent, { static: true }) hijoComponent: TesteditorComponent;
  @ViewChild(NotasComponent, { static: true }) hijonotaComponent: NotasComponent;
  datareceta: void;
  recetas: RecetaxPaciente[];
  editreceta: number | null;
  selectedFile: any;
  notas: nota[];
  showLoading: boolean = false;
  fechaconsultaactual: string;
  isLoading = false;
  @ViewChildren('input') inputs!: QueryList<ElementRef>; // Asume que todos los campos de entrada tienen la referencia #input

 

  constructor(private route: ActivatedRoute, private Service: Service, public dialog: MatDialog,private router: Router, private cd: ChangeDetectorRef) {

  }


  ngOnInit(): void {
    this.formatearfecha();
    this.parametro = this.route.snapshot.paramMap.get('id');
    if (Number(this.parametro)>0) {
      this.cargarContenidoPaciente(this.parametro);
      this.cargarImagenPaciente(this.parametro);
      this.cargarRecetasPaciente(this.parametro);
      this.cargarNotasPaciente(this.parametro);
      this.cargarImagenPerfilPaciente(this.parametro);
    }else{
      const pacienteVacio: Paciente = {
        id:0,
        clave: 0,
        sexo: '',
        fechaDeNacimiento: '', // Considera una fecha predeterminada si es necesario
        nombre: '',
        estadoCivil: '',
        ocupacion: '',
        domicilio: '',
        poblacion: '',
        telefono: '',
        email: '',
        nombreDelEsposo: '',
        edadDelEsposo: null,
        ocupacionEsposo: '',
        referencia: '',
        diabetes: '',
        hipertension: '',
        trombosis: '',
        cardiopatias: '',
        cancer: '',
        enfermedadesGeneticas: '',
        otraEnfermedad: '',
        inmunizaciones: '',
        alcoholismo: '',
        tabaquismo: '',
        tabaquismoPasivo: '',
        drogasOmedicamentos: '',
        grupoSanguineo: '',
        propiasDeLaInfancia: '',
        rubeola: '',
        amigdalitis: '',
        bronquitis: '',
        bronconeumonia: '',
        hepatitisViralTipo: '',
        parasitosis: '',
        toxoplasmosis: '',
        citomegalovirus: '',
        herpes: '',
        clamydiasis: '',
        hiv: '',
        sifilis: '',
        micosis: '',
        eip: '',
        diabetesMellitus: '',
        otrasEndocrinas: '',
        nefropatias: '',
        digestivas: '',
        neurologicas: '',
        hematologicas: '',
        tumores: '',
        condilomatosis: '',
        displasias: '',
        alergia: '',
        fechaConsulta: '',
        fechaUltimaConsulta: '',
      };
      
      this.cargarFormulario(pacienteVacio);
    }

  }


  cargarContenidoPaciente(parametrourl: any) {
    this.showLoading =true;
    this.Service.getUnicoParams('GetPacienteId', parametrourl).subscribe(
      (data: Paciente) => {
        this.cargarFormulario(data);
        this.pacientedatos = data;
        this.fechaconsultaactual = data.fechaConsulta;
      }
    );
  }

  formatearfecha() {
    this.fechaFormateada = `${this.dia < 10 ? '0' + this.dia : this.dia}/${this.mes < 10 ? '0' + this.mes : this.mes
      }/${this.año}`;
  }

  cargarFormulario(data: Paciente) {
    this.PacienteFormulario = new FormGroup({
      clave: new FormControl(data.clave),
      sexo: new FormControl(
        data.sexo === 'F' ? 'Femenino' : data.sexo === 'M' ? 'Masculino' : data.sexo
      ),
      fechaDeNacimiento: new FormControl(data.fechaDeNacimiento!='' ? this.formatDate(data.fechaDeNacimiento): null),
      nombre: new FormControl(data.nombre),
      estadoCivil: new FormControl(data.estadoCivil === 'C.' || data.estadoCivil === 'C' ? 'Casado' : data.estadoCivil === 'S' ? 'Soltero' : data.estadoCivil),
      ocupacion: new FormControl(data.ocupacion),
      domicilio: new FormControl(data.domicilio),
      poblacion: new FormControl(data.poblacion),
      telefono: new FormControl(data.telefono),
      email: new FormControl(data.email),
      nombreDelEsposo: new FormControl(data.nombreDelEsposo),
      edadDelEsposo: new FormControl(data.edadDelEsposo),
      ocupacionEsposo: new FormControl(data.ocupacionEsposo),
      referencia: new FormControl(data.referencia),
      diabetes: new FormControl(data.diabetes),
      hipertension: new FormControl(data.hipertension),
      trombosis: new FormControl(data.trombosis),
      cardiopatias: new FormControl(data.cardiopatias),
      cancer: new FormControl(data.cancer),
      enfermedadesGeneticas: new FormControl(data.enfermedadesGeneticas),
      otraEnfermedad: new FormControl(data.otraEnfermedad),
      inmunizaciones: new FormControl(data.inmunizaciones),
      alcoholismo: new FormControl(data.alcoholismo),
      tabaquismo: new FormControl(data.tabaquismo),
      tabaquismoPasivo: new FormControl(data.tabaquismoPasivo),
      drogasOmedicamentos: new FormControl(data.drogasOmedicamentos),
      grupoSanguineo: new FormControl(data.grupoSanguineo),
      propiasDeLaInfancia: new FormControl(data.propiasDeLaInfancia),
      rubeola: new FormControl(data.rubeola),
      amigdalitis: new FormControl(data.amigdalitis),
      bronquitis: new FormControl(data.bronquitis),
      bronconeumonia: new FormControl(data.bronconeumonia),
      hepatitisViralTipo: new FormControl(data.hepatitisViralTipo),
      parasitosis: new FormControl(data.parasitosis),
      toxoplasmosis: new FormControl(data.toxoplasmosis),
      citomegalovirus: new FormControl(data.citomegalovirus),
      herpes: new FormControl(data.herpes),
      clamydiasis: new FormControl(data.clamydiasis),
      hiv: new FormControl(data.hiv),
      sifilis: new FormControl(data.sifilis),
      micosis: new FormControl(data.micosis),
      eip: new FormControl(data.eip),
      diabetesMellitus: new FormControl(data.diabetesMellitus),
      otrasEndocrinas: new FormControl(data.otrasEndocrinas),
      nefropatias: new FormControl(data.nefropatias),
      digestivas: new FormControl(data.digestivas),
      neurologicas: new FormControl(data.neurologicas),
      hematologicas: new FormControl(data.hematologicas),
      tumores: new FormControl(data.tumores),
      condilomatosis: new FormControl(data.condilomatosis),
      displasias: new FormControl(data.displasias),
      alergia: new FormControl(data.alergia),
      fechaConsulta: new FormControl(data.fechaConsulta),
      fechaUltimaConsulta: new FormControl(data.fechaUltimaConsulta),
    });
  }

  formatDate(dateString: string): string {
    const fecha = new Date(dateString);
    return fecha.toISOString().split('T')[0];
  }

  openDialog(imageUrl: string): void {
    this.dialog.open(StandaloneGalleryComponent, {
      data: {
        img: imageUrl
      },
      panelClass: 'custom-dialog-container' // Opcional: para estilos personalizados3
    });
  }

  cargarImagenPaciente(parametrourl: any) {
    this.showLoading =true;
    this.Service.getListParams('GetImagenesPaciente', parametrourl).subscribe(
      (data: ImagenPaciente[]) => {
        if(data!=null)
        this.images = data.map((img) => ({
          src: `data:image/jpeg;base64,${img.blobData}`,
          alt: img.letra,
          id:img.id
        }));
      }
    );
  }

  cargarImagenPerfilPaciente(parametrourl: any) {
    this.showLoading = true; // Inicia la carga
    this.Service.getUnicoParams('GetFotoPaciente', parametrourl).subscribe({
      next: (data: FotoPaciente) => {
        // Comprueba si la data no es nula y actualiza la imagen de perfil
        if(data != null) {
          this.imagenperfil = {src: `data:image/jpeg;base64,${data.blobData}`};
        }
      },
      error: (error) => {
        this.showLoading = false; 
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
        console.error('Error al cargar la imagen del perfil del paciente:', error);
      },
      complete: () => {
        // Esto se ejecutará después de completar la suscripción, ya sea que haya sido exitosa o no
        this.showLoading = false; // Termina la carga
      }
    });
  }
  
  



  formatTextForHtml(inputText: string): string {
    let escapedHtml = inputText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Envuelve el texto formateado en una etiqueta <pre>
    let formattedText = escapedHtml.replace(/\n/g, '<br>');
    return `<pre>${formattedText}</pre>`;
  }

  saveData() {
    if (!this.PacienteFormulario.invalid) {
      this.showLoading = true; // Inicia la carga
      if (this.fechaconsultaactual != this.PacienteFormulario.get('fechaConsulta')?.value)
         this.PacienteFormulario.get('fechaUltimaConsulta')?.setValue(
           this.fechaconsultaactual
         );
        this.Service.postData(
          'PostPaciente',
          this.PacienteFormulario.value
        ).subscribe({
          next: (result) => {
            // Se llama si la operación es exitosa
            this.cargarFormulario(result);
            this.pacientedatos = result;
            this.pacientedatos.nombre = result.nombre;
             this.fechaconsultaactual =
               this.PacienteFormulario.get('fechaConsulta')?.value;
          },
          error: (error) => {
            // Se llama en caso de error en la operación
            console.error('Error al guardar los datos del paciente:', error);
            this.showLoading = false;
            // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
          },
          complete: () => {
            // Esto se ejecutará después de completar la suscripción, exitosa o no
            this.showLoading = false; // Termina la carga
          },
        });
    }
  }

  GuardarReceta(receta: any) {
    const r = receta;
    this.hijoComponent.saveText();
  }

  EditarReceta(receta: any) {
    const r = receta;
    this.hijoComponent.saveText();
  }

  GuardarNota(receta: any) {
    const r = receta;
    this.hijonotaComponent.saveText();
  }

  EditarNota(receta: any) {
    const r = receta;
    this.hijonotaComponent.saveText();
  }

  cargarRecetasPaciente(parametrourl: any) {
    this.showLoading =true;
    this.Service.getListParams('GetReceta', parametrourl).subscribe(
      (data: RecetaxPaciente[]) => {
        this.recetas = data;
      }
    );
  }

  cargarNotasPaciente(parametrourl: any) {
    this.showLoading =true;
    this.Service.getListParams('GetNotas', parametrourl).subscribe(
      (data: nota[]) => {
        this.notas = data;
      }
    );
  }

  ngAfterViewInit(): void {
    this.ajustarAltura(document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement);

  }

  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0] as File; // Afirmación de tipo aquí
    }
  }

  onFileSelectedPerfil(event: any): void {
    const input = event.target as HTMLInputElement;
    const file: File =  event.target.files[0];
    if (file) {
      this.resizeImage(file, 128, 128, (resizedImage) => {
        // Haz algo con la imagen redimensionada
        console.log(resizedImage);
        // Por ejemplo, convertirlo a un archivo y prepararlo para ser enviado a un servidor
        this.selectedFile = new File([resizedImage], "resized-image.jpg", { type: "image/jpeg" });
      });
    }
   
  }

  resizeImage(file: File, width: number, height: number, callback: (resizedImage: Blob) => void) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          callback(blob!);
        }, 'image/jpeg');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  upload(): void {
    this.showLoading = true;
    this.cd.detectChanges();  // Forzar la detección de cambios aquí

    if (!this.selectedFile) {
      // Use SweetAlert2 to display the alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona un archivo primero.'
      }).then(() => {
        this.showLoading = false;
        this.cd.detectChanges();  // Forzar la detección de cambios después de actualizar showLoading
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    formData.append('id', this.parametro || '');

    this.Service.postData('PostImagen', formData)
      .pipe(
        finalize(() => {
          this.showLoading = false;
          this.cd.detectChanges();  // Forzar la detección de cambios en finalize
        }),
        catchError((error) => {
          console.error('Error uploading image:', error);
          return of([]);  // Maneja el error y continúa el flujo
        })
      )
      .subscribe(
        (data: ImagenPaciente[]) => {
          this.images = data.map((img) => ({
            src: `data:image/jpeg;base64,${img.blobData}`,
            alt: img.letra,
            id:img.id
          }));
          this.cd.detectChanges();  // Opcional, si es necesario después de cambiar 'images'
        }
      );
  }



    animationCreated(animationItem: AnimationItem): void {
      console.log(animationItem);
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      const key = event.key;
      if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(key)) {
        event.preventDefault(); // Previene el desplazamiento de la página
        this.navigateFields(key);
      }
    }
    
    navigateFields(key: string) {
      const currentElement = document.activeElement;
      const inputs = this.inputs.toArray();
      const currentIndex = inputs.findIndex(input => input.nativeElement === currentElement);
      if (currentIndex === -1) return; // Si no encuentra el índice, sale
    
      let targetIndex = currentIndex; // Inicializa con el índice actual
      switch(key) {
        case 'ArrowRight':
        case 'ArrowDown': // Trata las flechas derecha y abajo de la misma manera
          targetIndex = currentIndex < inputs.length - 1 ? currentIndex + 1 : currentIndex;
          break;
        case 'ArrowLeft':
        case 'ArrowUp': // Trata las flechas izquierda y arriba de la misma manera
          targetIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
          break;
      }
      
      inputs[targetIndex].nativeElement.focus();
    }
    
    uploadImagenPerfil(): void {
      this.showLoading = true;
      this.cd.detectChanges();  // Forzar detección de cambios aquí para mostrar el loading
  
      if (!this.selectedFile) {
        // Uso de SweetAlert2 para mostrar alerta
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, selecciona un archivo primero.'
        }).then(() => {
          this.showLoading = false;
          this.cd.detectChanges();  // Forzar detección de cambios después de actualizar showLoading
        });
        return;
      }
  
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      formData.append('id', this.parametro || '');
  
      this.Service.postData('PostImagenPerfil', formData)
        .pipe(
          catchError((error) => {
            console.error('Error uploading profile image:', error);
            return of(null);  // Continúa el flujo incluso con error
          }),
          finalize(() => {
            this.showLoading = false;
            this.cd.detectChanges();  // Forzar detección de cambios en finalize
          })
        )
        .subscribe(
          (data: FotoPaciente) => {
            if (data != null) {
              this.imagenperfil = {src: `data:image/jpeg;base64,${data.blobData}`};
            } else {
              // Opcional: manejo de caso cuando no hay datos
              Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'No se recibió ninguna imagen.'
              });
            }
            this.cd.detectChanges();  // Forzar detección de cambios si es necesario
          }
        );
    }

    deleteImage(id:number){
      this.Service.postData('DeleteImagenPaciente',id )
      .pipe(
        catchError((error) => {
          console.error('Error uploading profile image:', error);
          return of(null);  // Continúa el flujo incluso con error
        }),
        finalize(() => {
          this.showLoading = false;
          this.cd.detectChanges();  // Forzar detección de cambios en finalize
        })
      )
      .subscribe(
        (data: ImagenPaciente[]) => {
          this.images = data.map((img) => ({
            src: `data:image/jpeg;base64,${img.blobData}`,
            alt: img.letra,
            id:img.id
          }));
          this.cd.detectChanges();  // Opcional, si es necesario después de cambiar 'images'
        }
      );
    }    
    
}
   

