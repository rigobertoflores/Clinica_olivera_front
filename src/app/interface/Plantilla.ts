export interface Plantilla {
  id: number;
  Nombre: string;
  Asunto: string;
  CuerpoEmail: string;
  FechaEnvio: string;
  Adjunto: string;
}


export interface PacientesPlantillas {
  pacientesActivos: { pacientesActivos: NotificacionPacientes };
  pacientesInactivos: { pacientesInactivos: NotificacionPacientes };
}

export interface NotificacionPacientes {
  email: string;
  fechaConsulta: string;
  nombre: string;
}

