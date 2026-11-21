export type IncidentPriority = "BAJA" | "MEDIA" | "ALTA";
export type IncidentStatus = "PENDIENTE" | "EN_PROCESO" | "RESUELTA";

export interface ICreateIncidentDTO {
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: IncidentPriority;
}