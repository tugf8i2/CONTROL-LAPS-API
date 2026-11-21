import { DomainError } from '../errors/domain.error';
import type { ICreateEquipoDTO, IUpdateEquipoDTO } from '../dtos/equipo.dto';
import type { Equipment, EquipmentStatus, EquipmentType, Room } from '../models/entities';
import type { EquipmentRepository } from '../repositories/equipment.repository';
import type { RoomRepository } from '../repositories/room.repository';

const TYPES: EquipmentType[] = ['COMPUTADOR', 'MOUSE', 'TECLADO', 'CARGADOR', 'TELEVISOR', 'CONTROL_TV'];
const STATES: EquipmentStatus[] = ['OPERATIVO', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO'];

export class EquipmentService {
  constructor(
    private readonly repository: EquipmentRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  create(input: ICreateEquipoDTO): Equipment {
    const placaSena = this.text(input.placaSena, 'La placa SENA');
    const codigoActivo = this.text(input.codigoActivo, 'El código de activo');
    if (!TYPES.includes(input.tipo)) throw new DomainError('VALIDATION_ERROR', 'El tipo de equipo no es válido.');
    const estado = input.estado ?? 'OPERATIVO';
    this.validateState(estado);
    this.assertUniqueCodes(placaSena, codigoActivo);
    const room = this.operationalRoom(input.roomId);
    if (input.tipo === 'COMPUTADOR') this.assertRoomCapacity(room);
    return this.repository.create({ placaSena, codigoActivo, tipo: input.tipo, roomId: room.id, estado });
  }

  list(filters: { roomId?: string; estado?: string; tipo?: string } = {}): Equipment[] {
    if (filters.estado !== undefined && !STATES.includes(filters.estado as EquipmentStatus)) {
      throw new DomainError('VALIDATION_ERROR', 'El filtro estado no es válido.');
    }
    if (filters.tipo !== undefined && !TYPES.includes(filters.tipo as EquipmentType)) {
      throw new DomainError('VALIDATION_ERROR', 'El filtro tipo no es válido.');
    }
    return this.repository.findAll({
      roomId: filters.roomId,
      estado: filters.estado as EquipmentStatus | undefined,
      tipo: filters.tipo as EquipmentType | undefined
    });
  }

  getById(id: string): Equipment {
    const item = this.repository.findById(id);
    if (!item) throw new DomainError('NOT_FOUND', 'No existe el equipo solicitado.');
    return item;
  }

  update(id: string, input: IUpdateEquipoDTO): Equipment {
    const current = this.getById(id);
    const placaSena = input.placaSena === undefined ? current.placaSena : this.text(input.placaSena, 'La placa SENA');
    const codigoActivo = input.codigoActivo === undefined ? current.codigoActivo : this.text(input.codigoActivo, 'El código de activo');
    this.assertUniqueCodes(placaSena, codigoActivo, id);

    const changes: IUpdateEquipoDTO = { placaSena, codigoActivo };
    if (input.tipo !== undefined) {
      if (!TYPES.includes(input.tipo)) throw new DomainError('VALIDATION_ERROR', 'El tipo de equipo no es válido.');
      changes.tipo = input.tipo;
    }
    if (input.estado !== undefined) {
      this.validateState(input.estado);
      changes.estado = input.estado;
    }
    if (input.roomId !== undefined) changes.roomId = this.operationalRoom(input.roomId).id;

    const nextRoom = this.roomRepository.findById(changes.roomId ?? current.roomId);
    const nextType = changes.tipo ?? current.tipo;
    if (!nextRoom) throw new DomainError('NOT_FOUND', 'El ambiente indicado no existe.');
    if (nextType === 'COMPUTADOR' &&
      (nextRoom.id !== current.roomId || current.tipo !== 'COMPUTADOR')) {
      this.assertRoomCapacity(nextRoom, current.id);
    }
    return this.repository.update(id, changes) as Equipment;
  }

  move(id: string, roomId: string): Equipment {
    return this.update(id, { roomId });
  }

  private operationalRoom(id: string): Room {
    const room = this.roomRepository.findById(id);
    if (!room) throw new DomainError('NOT_FOUND', 'El ambiente indicado no existe.');
    if (room.estado !== 'OPERATIVO') {
      throw new DomainError('CONFLICT', 'No se pueden asignar equipos a un ambiente no operativo.');
    }
    return room;
  }

  private assertRoomCapacity(room: Room, excludedEquipmentId?: string): void {
    const installed = this.repository.findAll({ roomId: room.id, tipo: 'COMPUTADOR' })
      .filter((item) => item.id !== excludedEquipmentId).length;
    if (installed >= room.capacidadPcs) {
      throw new DomainError('CONFLICT', 'El ambiente alcanzó su capacidad de computadores.');
    }
  }

  private assertUniqueCodes(placaSena: string, codigoActivo: string, excludedId?: string): void {
    const items = this.repository.findAll();
    if (items.some((item) => item.id !== excludedId && item.placaSena.toLowerCase() === placaSena.toLowerCase())) {
      throw new DomainError('CONFLICT', 'La placa SENA ya está registrada.');
    }
    if (items.some((item) => item.id !== excludedId && item.codigoActivo.toLowerCase() === codigoActivo.toLowerCase())) {
      throw new DomainError('CONFLICT', 'El código de activo ya está registrado.');
    }
  }

  private text(value: string, label: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new DomainError('VALIDATION_ERROR', `${label} es obligatorio.`);
    }
    return value.trim();
  }

  private validateState(state: EquipmentStatus): void {
    if (!STATES.includes(state)) throw new DomainError('VALIDATION_ERROR', 'El estado del equipo no es válido.');
  }
}