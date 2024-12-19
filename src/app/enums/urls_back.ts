export enum UrlsBackend {
  ApiPacientes = 'https://clinicaolivera.azurewebsites.net/CliniaOv/CliniaOvController/',
  ApiTratamientos = 'https://clinicaolivera.azurewebsites.net/api/Tratamientos/TratamientosController/',
  ApiNotificacion = 'https://clinicaolivera.azurewebsites.net/api/NotificationEmail/NotificationEmailController/',
  ApiAuth = 'https://clinicaolivera.azurewebsites.net/api/Authentication/AuthenticationController/',
  Reports = 'https://clinicaolivera.azurewebsites.net/api/Reports/ReportsController/',
}

// export enum UrlsBackend {
//   ApiPacientes = 'https://localhost:7210/CliniaOv/CliniaOvController/',
//   ApiTratamientos = 'https://localhost:7210/api/Tratamientos/TratamientosController/',
//   ApiNotificacion = 'https://localhost:7210/api/NotificationEmail/NotificationEmailController/',
//   ApiAuth = 'https://localhost:7210/api/Authentication/AuthenticationController/',
//   Reports = 'https://localhost:7210/api/Reports/ReportsController/',
// }

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
  ObtenerStatusCorreos = 'ObtenerStatusCorreos',
  SendEmailFelicitaciones = 'SendEmailFelicitaciones',
}

export enum UrlsPacientes {
  GetPacientesNotificaciones = 'GetPacientesNotificacionesCitas',
  GetCitasPorFecha = 'GetCitasPorFecha',
  PrintCompleteFile = 'PrintCompleteFile',
}

export enum UrlsAuth {
  GetUsersPermitidos = 'GetUsersPermitidos',
}

export enum UrlsReports {
  UltimasConsultas = 'UltimasConsultas',
  RangosDeEdad = 'RangosDeEdad',
}
