import { DomainError } from "../errors/domain.error.js";
import type { ICreateAmbienteDTO, IUpdateAmbienteDTO, RoomStatus } from "../dtos/ambiente.dto.js";
import type { Room, RoomRepository } from "../repositories/room.repository.js";

const STATUSES: RoomStatus[] = ["OPERATIVO", "MANTENIMIENTO", "INACTIVO"];

export class RoomService {
  constructor(private readonly repository: RoomRepository) {}

  async create(input: ICreateAmbienteDTO): Promise<Room> {
    const nombre = this.requiredText(input.nombre, "El nombre");
    const bloque = this.requiredText(input.bloque, "El bloque");
    const capacidadPcs = this.validateCapacity(input.capacidadPcs);
    const estado = input.estado ?? "OPERATIVO";
    this.validateStatus(estado);

    if (await this.repository.findByName(nombre)) {
      throw new DomainError("CONFLICT", "Ya existe un ambiente con ese nombre.");
    }

    return this.repository.create({ nombre, bloque, capacidadPcs, estado });
  }

  async list(filters: { estado?: string; bloque?: string } = {}): Promise<Room[]> {
    const query: { estado?: RoomStatus; bloque?: string } = {};
    if (filters.estado !== undefined) {
      this.validateStatus(filters.estado);
      query.estado = filters.estado as RoomStatus;
    }
    if (filters.bloque !== undefined) {
      query.bloque = this.requiredText(filters.bloque, "El bloque");
    }
    return this.repository.findAll(query);
  }

  async getById(id: string): Promise<Room> {
    const room = await this.repository.findById(id);
    if (!room) throw new DomainError("NOT_FOUND", "No existe el ambiente solicitado.");
    return room;
  }

  async update(id: string, input: IUpdateAmbienteDTO): Promise<Room> {
    await this.getById(id);
    const changes: IUpdateAmbienteDTO = {};

    if (input.nombre !== undefined) {
      changes.nombre = this.requiredText(input.nombre, "El nombre");
      const existing = await this.repository.findByName(changes.nombre);
      if (existing && existing.id !== id) {
        throw new DomainError("CONFLICT", "Ya existe un ambiente con ese nombre.");
      }
    }
    if (input.bloque !== undefined) changes.bloque = this.requiredText(input.bloque, "El bloque");
    if (input.capacidadPcs !== undefined) changes.capacidadPcs = this.validateCapacity(input.capacidadPcs);
    if (input.estado !== undefined) {
      this.validateStatus(input.estado);
      changes.estado = input.estado;
    }
    if (Object.keys(changes).length === 0) {
      throw new DomainError("VALIDATION_ERROR", "No se recibieron campos editables.");
    }

    const updated = await this.repository.update(id, changes);
    if (!updated) throw new DomainError("NOT_FOUND", "No existe el ambiente solicitado.");
    return updated;
  }

  async setStatus(id: string, estado: RoomStatus): Promise<Room> {
    return this.update(id, { estado });
  }

  private validateCapacity(value: number): number {
    if (!Number.isInteger(value) || value < 0) {
      throw new DomainError("VALIDATION_ERROR", "La capacidad debe ser un entero mayor o igual a cero.");
    }
    return value;
  }

  private validateStatus(value: string): void {
    if (!STATUSES.includes(value as RoomStatus)) {
      throw new DomainError("VALIDATION_ERROR", "El estado del ambiente no es válido.");
    }
  }

  private requiredText(value: string, label: string): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new DomainError("VALIDATION_ERROR", `${label} es obligatorio.`);
    }
    return value.trim();
  }
}