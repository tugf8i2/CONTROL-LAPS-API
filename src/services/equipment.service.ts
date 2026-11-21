import { DomainError } from "../errors/domain.error.js";
import type { ICreateEquipoDTO, IUpdateEquipoDTO, EquipmentStatus, EquipmentType } from "../dtos/equipo.dto.js";
import type { Equipment, EquipmentRepository } from "../repositories/equipment.repository.js";
import type { RoomRepository } from "../repositories/room.repository.js";

const TYPES: EquipmentType[] = [
  "COMPUTADOR", "MOUSE", "TECLADO", "CARGADOR", "TELEVISOR", "CONTROL_TV"
];
const STATUSES: EquipmentStatus[] = ["OPERATIVO", "MANTENIMIENTO", "FUERA_DE_SERVICIO"];

export class EquipmentService {
  constructor(
    private readonly equipmentRepository: EquipmentRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  async create(input: ICreateEquipoDTO): Promise<Equipment> {
    const placaSena = this.requiredText(input.placaSena, "La placa SENA");
    const codigoActivo = this.requiredText(input.codigoActivo, "El código del activo");
    this.validateType(input.tipo);
    const estado = input.estado ?? "OPERATIVO";
    this.validateStatus(estado);

    const room = await this.roomRepository.findById(input.roomId);
    if (!room) throw new DomainError("NOT_FOUND", "No existe el ambiente indicado.");
    if (room.estado !== "OPERATIVO") {
      throw new DomainError("CONFLICT", "No se pueden registrar equipos en un ambiente no operativo.");
    }

    if (await this.equipmentRepository.findByPlaca(placaSena)) {
      throw new DomainError("CONFLICT", "Ya existe un equipo con esa placa SENA.");
    }
    if (await this.equipmentRepository.findByAssetCode(codigoActivo)) {
      throw new DomainError("CONFLICT", "Ya existe un equipo con ese código de activo.");
    }

    if (input.tipo === "COMPUTADOR") {
      const installed = await this.equipmentRepository.countComputersInRoom(room.id);
      if (installed >= room.capacidadPcs) {
        throw new DomainError("CONFLICT", "El ambiente alcanzó su capacidad de computadores.");
      }
    }

    return this.equipmentRepository.create({
      placaSena,
      codigoActivo,
      tipo: input.tipo,
      roomId: room.id,
      estado
    });
  }

  async list(filters: { roomId?: string; estado?: string; tipo?: string } = {}): Promise<Equipment[]> {
    const query: { roomId?: string; estado?: EquipmentStatus; tipo?: EquipmentType } = {};
    if (filters.roomId !== undefined) {
      if (!this.isUuid(filters.roomId)) {
        throw new DomainError("VALIDATION_ERROR", "roomId debe ser un UUID válido.");
      }
      query.roomId = filters.roomId.toLowerCase();
    }
    if (filters.estado !== undefined) {
      this.validateStatus(filters.estado);
      query.estado = filters.estado as EquipmentStatus;
    }
    if (filters.tipo !== undefined) {
      this.validateType(filters.tipo);
      query.tipo = filters.tipo as EquipmentType;
    }
    return this.equipmentRepository.findAll(query);
  }

  async getById(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) throw new DomainError("NOT_FOUND", "No existe el equipo solicitado.");
    return equipment;
  }

  async update(id: string, input: IUpdateEquipoDTO): Promise<Equipment> {
    const current = await this.getById(id);
    const changes: IUpdateEquipoDTO = {};

    if (input.placaSena !== undefined) {
      changes.placaSena = this.requiredText(input.placaSena, "La placa SENA");
      const existing = await this.equipmentRepository.findByPlaca(changes.placaSena);
      if (existing && existing.id !== id) {
        throw new DomainError("CONFLICT", "Ya existe un equipo con esa placa SENA.");
      }
    }
    if (input.codigoActivo !== undefined) {
      changes.codigoActivo = this.requiredText(input.codigoActivo, "El código del activo");
      const existing = await this.equipmentRepository.findByAssetCode(changes.codigoActivo);
      if (existing && existing.id !== id) {
        throw new DomainError("CONFLICT", "Ya existe un equipo con ese código de activo.");
      }
    }
    const nextType = input.tipo ?? current.tipo;
    if (input.tipo !== undefined) this.validateType(input.tipo);
    if (input.tipo !== undefined) changes.tipo = input.tipo;

    if (input.estado !== undefined) {
      this.validateStatus(input.estado);
      changes.estado = input.estado;
    }

    if (input.roomId !== undefined && input.roomId !== current.roomId) {
      const destination = await this.roomRepository.findById(input.roomId);
      if (!destination) throw new DomainError("NOT_FOUND", "No existe el ambiente de destino.");
      if (destination.estado !== "OPERATIVO") {
        throw new DomainError("CONFLICT", "El ambiente de destino no está operativo.");
      }
      if (nextType === "COMPUTADOR") {
        const installed = await this.equipmentRepository.countComputersInRoom(destination.id);
        if (installed >= destination.capacidadPcs) {
          throw new DomainError("CONFLICT", "El ambiente de destino alcanzó su capacidad de computadores.");
        }
      }
      changes.roomId = destination.id;
    }

    if (Object.keys(changes).length === 0) {
      throw new DomainError("VALIDATION_ERROR", "No se recibieron campos editables.");
    }

    const updated = await this.equipmentRepository.update(id, changes);
    if (!updated) throw new DomainError("NOT_FOUND", "No existe el equipo solicitado.");
    return updated;
  }

  private validateType(value: string): void {
    if (!TYPES.includes(value as EquipmentType)) {
      throw new DomainError("VALIDATION_ERROR", "El tipo de equipo no está permitido.");
    }
  }

  private validateStatus(value: string): void {
    if (!STATUSES.includes(value as EquipmentStatus)) {
      throw new DomainError("VALIDATION_ERROR", "El estado del equipo no está permitido.");
    }
  }

  private requiredText(value: string, label: string): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new DomainError("VALIDATION_ERROR", `${label} es obligatorio.`);
    }
    return value.trim();
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }
}