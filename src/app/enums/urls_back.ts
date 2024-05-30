export enum UrlsBackend {
  ApiPacientes = 'https://localhost:7210/CliniaOv/CliniaOvController/',
  ApiTratamientos = 'https://localhost:7210/api/Tratamientos/TratamientosController/',
  ApiNotificacion = 'https://localhost:7210/api/NotificationEmail/NotificationEmailController/',
}

export enum UrlsTratamientos {
  Get = 'GetTratamientos',
  GetById = 'GetTratamientoId',
  Insert = 'PostInsertTratamientos',
  Edit = 'EditTratamiento',
  Delete = 'DeleteTratamiento',
}

export enum UrlsPlantillas {
  Get = 'GetPlantilla',
  GetById = 'GetPlantillaId',
  Post = 'PostPlantillas',
  Delete = 'DeletePlantilla',
  GetPacientesVinculadosPP = 'PacientesVinculadosPP',
  PostAgregarVinculo = 'AgregarVinculoPlantillasPacientes',
  DeleteEliminarVinculo = 'EliminarVinculoPlantillasPacientes',
  SendEmail = 'SendEmail',
}

export enum UrlsPacientes {
  GetPacientesNotificaciones = 'GetPacientesNotificacionesCitas',
  GetCitasPorFecha ='GetCitasPorFecha',
}
