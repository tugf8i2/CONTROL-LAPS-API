import { DomainError } from '../errors/domain.error';
import type { ICreateAmbienteDTO, IUpdateAmbienteDTO } from '../dtos/ambiente.dto';
import type { Room, RoomStatus } from '../models/entities';
import type { EquipmentRepository } from '../repositories/equipment.repository';
import type { RoomRepository } from '../repositories/room.repository';

const STATES: RoomStatus[] = ['OPERATIVO', 'MANTENIMIENTO', 'INACTIVO'];

export class RoomService {
  constructor(
    private readonly repository: RoomRepository,
    private readonly equipmentRepository: EquipmentRepository
  ) {}

  create(input: ICreateAmbienteDTO): Room {
    const nombre = this.text(input.nombre, 'El nombre');
    const bloque = this.text(input.bloque, 'El bloque');
    const capacidadPcs = this.capacity(input.capacidadPcs);
    const estado = input.estado ?? 'OPERATIVO';
    this.validateState(estado);
    this.assertUniqueName(nombre);
    return this.repository.create({ nombre, bloque, capacidadPcs, estado });
  }

  list(filters: { estado?: string; bloque?: string } = {}): Room[] {
    if (filters.estado !== undefined && !STATES.includes(filters.estado as RoomStatus)) {
      throw new DomainError('VALIDATION_ERROR', 'El filtro estado no es válido.');
    }
    return this.repository.findAll({
      estado: filters.estado as RoomStatus | undefined,
      bloque: filters.bloque
    });
  }

  getById(id: string): Room {
    const room = this.repository.findById(id);
    if (!room) throw new DomainError('NOT_FOUND', 'No existe el ambiente solicitado.');
    return room;
  }

  update(id: string, input: IUpdateAmbienteDTO): Room {
    const current = this.getById(id);
    const changes: IUpdateAmbienteDTO = {};
    if (input.nombre !== undefined) {
      changes.nombre = this.text(input.nombre, 'El nombre');
      this.assertUniqueName(changes.nombre, current.id);
    }
    if (input.bloque !== undefined) changes.bloque = this.text(input.bloque, 'El bloque');
    if (input.capacidadPcs !== undefined) {
      changes.capacidadPcs = this.capacity(input.capacidadPcs);
      const installed = this.equipmentRepository.findAll({ roomId: id, tipo: 'COMPUTADOR' }).length;
      if (changes.capacidadPcs < installed) {
        throw new DomainError('CONFLICT', 'La capacidad no puede ser menor que los computadores instalados.');
      }
    }
    if (input.estado !== undefined) {
      this.validateState(input.estado);
      changes.estado = input.estado;
    }
    if (Object.keys(changes).length === 0) {
      throw new DomainError('VALIDATION_ERROR', 'No se recibieron campos editables.');
    }
    return this.repository.update(id, changes) as Room;
  }

  setStatus(id: string, estado: RoomStatus): Room {
    this.getById(id);
    this.validateState(estado);
    return this.repository.update(id, { estado }) as Room;
  }

  private assertUniqueName(nombre: string, excludedId?: string): void {
    const duplicate = this.repository.findAll().some((room) =>
      room.id !== excludedId && room.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (duplicate) throw new DomainError('CONFLICT', 'Ya existe un ambiente con ese nombre.');
  }

  private text(value: string, label: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new DomainError('VALIDATION_ERROR', `${label} es obligatorio.`);
    }
    return value.trim();
  }

  private capacity(value: number): number {
    if (!Number.isInteger(value) || value < 0) {
      throw new DomainError('VALIDATION_ERROR', 'La capacidad debe ser un entero mayor o igual a cero.');
    }
    return value;
  }

  private validateState(state: RoomStatus): void {
    if (!STATES.includes(state)) {
      throw new DomainError('VALIDATION_ERROR', 'El estado del ambiente no es válido.');
    }
  }
}