import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MenuComponent } from '../components/menu/menu.component';
import { Chart, registerables } from 'chart.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Service } from '../Services/Service';
import { UrlsBackend, UrlsReports } from '../enums/urls_back';

@Component({
  selector: 'app-reportes-pacientes',
  standalone: true,
  imports: [
    SidebarComponent,
    MenuComponent,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './reportes-pacientes.component.html',
  styleUrl: './reportes-pacientes.component.css',
})
export class ReportesPacientesComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChartCanvas')
  private lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;
  selectedDate: any;
  ReporteConsultasForm: FormGroup;
  pacientes: any = 0;
  showLoading: boolean = false;
  pacientesPorEdad: any = null;
  isGraphVisible: boolean = false;
  lineChart: Chart | null = null;

  ngOnInit(): void {
    this.ReporteConsultasForm.valueChanges.subscribe((formValues) => {
      const { fechaInicio, fechaFin } = formValues;
      if (fechaInicio && fechaFin) {
        this.getConsultasPorFecha();
      }
    });
  }

  ngAfterViewInit(): void {
    this.getRangosEdades();
    this.getConsultasPorFecha();
  }

  constructor(
    private Service: Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const currentDate = new Date();
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    this.ReporteConsultasForm = new FormGroup({
      fechaInicio: new FormControl(formattedDate),
      fechaFin: new FormControl(formattedDate),
    });

    Chart.register(...registerables); //para cargar los tipos de grafica primero
  }

  getRangosEdades() {
    this.showLoading = true;
    this.Service.PostData(
      UrlsBackend.Reports,
      UrlsReports.RangosDeEdad,
      null
    ).subscribe({
      next: (response) => {
        console.log('rangos de edad', response);
        this.pacientesPorEdad = [
          response.rango_0_18,
          response.rango_19_35,
          response.rango_36_50,
          response.rango_51_Plus,
        ];
        this.inicializarGraficoDoughnut(this.pacientesPorEdad);
        this.showLoading = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al cargar las edades de los pacientes',
        });

        this.showLoading = false;
      },
    });
  }

  private inicializarGraficoDoughnut(data: any) {
    if (!this.chartCanvas || data == null) {
      console.error(
        'Canvas no encontrado o edades no calculadadas, edades:.',
        data
      );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al cargar la grafica',
      });
      return;
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'doughnut', // Tipo de gráfico: 'pie', 'bar', 'line',doughnut, etc.
        data: {
          labels: ['0-18 años', '19-35 años', '36-50 años', '51+ años'],
          datasets: [
            {
              data: data,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Distribución de Edades por Pacientes',
            },
          },
        },
      });
    }
  }

  getConsultasPorFecha() {
    this.showLoading = true;
    const formData = new FormData();
    formData.append(
      'fechaInicio',
      this.ReporteConsultasForm.get('fechaInicio')?.value
    );
    formData.append(
      'fechaFin',
      this.ReporteConsultasForm.get('fechaFin')?.value
    );

    this.Service.PostData(
      UrlsBackend.Reports,
      UrlsReports.UltimasConsultas,
      formData
    ).subscribe({
      next: (response) => {
        console.log('info de consultas', response);
        this.pacientes = response;
        if (this.isGraphVisible) {
          this.createLineChart();
        }
        this.showLoading = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al cargar las edades de los pacientes',
        });

        this.showLoading = false;
      },
    });
  }

  toggleGraphVisibility(): void {
    this.isGraphVisible = !this.isGraphVisible;

    if (this.isGraphVisible) {     
      this.createLineChart();
    } else {
      this.destroyChart();
    }
  }
  createLineChart(): void {
    console.log('se realiza llamado a grafico de linea');

    if (this.lineChart) {
      this.lineChart.destroy();
    }
    if (!this.lineChartCanvas || !this.lineChartCanvas.nativeElement) {
      console.error('El canvas para el gráfico de línea no está disponible.');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al cargar la grafica',
      });
      return;
    }

    const consultasPorFecha: { [fecha: string]: number } = {};

    this.pacientes.detallePacientes.forEach((paciente: any) => {
      const fecha = new Date(paciente.fechaUltimaConsulta).toLocaleDateString();
      if (consultasPorFecha[fecha]) {
        consultasPorFecha[fecha]++;
      } else {
        consultasPorFecha[fecha] = 1;
      }
    });

    // 2. Generar las etiquetas y los valores
    const fechas = Object.keys(consultasPorFecha).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    const totalConsultas = fechas.map((fecha) => consultasPorFecha[fecha]);

    // 3. Obtener el contexto y crear la gráfica
    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Error: No se pudo obtener el contexto del canvas.');
      return;
    }

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: fechas, // Fechas agrupadas
        datasets: [
          {
            label: 'Consultas realizadas',
            data: totalConsultas, // Total de consultas por fecha
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointRadius: 5,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Número de Consultas por Día',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fechas',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Consultas',
            },
            ticks: {
              stepSize: 1, // Mostrar solo valores enteros
            },
          },
        },
      },
    });
  }



  // Destruir el gráfico
  destroyChart(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }
  }
}
