import { DomainError } from '../errors/domain.error';
import type { ICreateLoanDTO } from '../dtos/loan.dto';
import type { Equipment, LoanWithEquipment, User } from '../models/entities';
import type { EquipmentRepository } from '../repositories/equipment.repository';
import type { LoanRepository } from '../repositories/loan.repository';
import type { RoomRepository } from '../repositories/room.repository';
import type { UserRepository } from '../repositories/user.repository';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class LoanService {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
    private readonly equipmentRepository: EquipmentRepository
  ) {}

  create(input: ICreateLoanDTO): LoanWithEquipment {
    this.validateUuid(input.roomId, 'roomId');
    this.validateUuid(input.instructorId, 'instructorId');
    this.validateUuid(input.guardaId, 'guardaId');
    if (!Number.isInteger(input.numeroPc) || input.numeroPc <= 0) {
      throw new DomainError('VALIDATION_ERROR', 'numeroPc debe ser un entero positivo.');
    }

    const roomId = input.roomId.toLowerCase();
    const room = this.roomRepository.findById(roomId);
    if (!room) throw new DomainError('NOT_FOUND', 'El ambiente indicado no existe.');
    if (room.estado !== 'OPERATIVO') {
      throw new DomainError('CONFLICT', 'No se pueden crear préstamos para un ambiente no operativo.');
    }

    const instructor = this.requireUser(input.instructorId, 'INSTRUCTOR');
    const guarda = this.requireUser(input.guardaId, 'GUARDA');
    const activeIds = new Set(this.loanRepository.getActiveEquipmentIds());

    let equipmentIds: string[];
    if (input.equipmentIds === undefined) {
      equipmentIds = this.equipmentRepository.findAll({
        roomId,
        tipo: 'COMPUTADOR',
        estado: 'OPERATIVO'
      })
        .filter((item) => !activeIds.has(item.id))
        .slice(0, input.numeroPc)
        .map((item) => item.id);
    } else {
      if (!Array.isArray(input.equipmentIds) ||
        input.equipmentIds.some((id) => typeof id !== 'string' || !UUID_PATTERN.test(id))) {
        throw new DomainError('VALIDATION_ERROR', 'equipmentIds debe contener UUID válidos.');
      }
      equipmentIds = input.equipmentIds.map((id) => id.toLowerCase());
      if (new Set(equipmentIds).size !== equipmentIds.length) {
        throw new DomainError('VALIDATION_ERROR', 'equipmentIds contiene identificadores repetidos.');
      }
    }

    const selected: Equipment[] = equipmentIds.map((id) => {
      const item = this.equipmentRepository.findById(id);
      if (!item) throw new DomainError('NOT_FOUND', `No existe el equipo ${id}.`);
      if (item.roomId !== roomId) {
        throw new DomainError('CONFLICT', 'Todos los equipos deben pertenecer al ambiente del préstamo.');
      }
      if (item.estado !== 'OPERATIVO') {
        throw new DomainError('CONFLICT', 'Solo se pueden prestar equipos operativos.');
      }
      if (activeIds.has(id)) {
        throw new DomainError('CONFLICT', `El equipo ${id} ya tiene un préstamo activo.`);
      }
      return item;
    });

    const assignedComputers = selected.filter((item) => item.tipo === 'COMPUTADOR').length;
    if (assignedComputers !== input.numeroPc) {
      throw new DomainError('CONFLICT', 'La cantidad de computadores asignados debe coincidir con numeroPc.');
    }

    return this.loanRepository.createWithEquipment({
      roomId,
      instructorId: instructor.id,
      guardaId: guarda.id,
      numeroPc: input.numeroPc
    }, equipmentIds);
  }

  list(filters: { roomId?: string } = {}): LoanWithEquipment[] {
    if (filters.roomId !== undefined) this.validateUuid(filters.roomId, 'roomId');
    return this.loanRepository.findAllWithEquipment({
      roomId: filters.roomId?.toLowerCase()
    });
  }

  getById(id: string): LoanWithEquipment {
    const loanId = this.positiveId(id);
    const loan = this.loanRepository.findByIdWithEquipment(loanId);
    if (!loan) throw new DomainError('NOT_FOUND', `No existe un préstamo con identificador ${loanId}.`);
    return loan;
  }

  accept(id: string): LoanWithEquipment {
    const loanId = this.positiveId(id);
    const updated = this.loanRepository.updateStatus(
      loanId,
      'PENDIENTE_APROBACION',
      'APROBADO_Y_FIRMADO'
    );
    if (updated) return updated;
    if (!this.loanRepository.findById(loanId)) {
      throw new DomainError('NOT_FOUND', `No existe un préstamo con identificador ${loanId}.`);
    }
    throw new DomainError('CONFLICT', 'El préstamo ya fue aceptado y no puede aceptarse nuevamente.');
  }

  returnEquipment(id: string, equipmentId: string): LoanWithEquipment {
    const loan = this.getById(id);
    if (loan.estado !== 'APROBADO_Y_FIRMADO') {
      throw new DomainError('CONFLICT', 'Solo se pueden devolver equipos de un préstamo aprobado.');
    }
    const returned = this.loanRepository.returnEquipment(loan.id, equipmentId);
    if (!returned) throw new DomainError('CONFLICT', 'El equipo no está asignado activamente a este préstamo.');
    return this.getById(String(loan.id));
  }

  returnAllEquipment(id: string): LoanWithEquipment {
    const loan = this.getById(id);
    if (loan.estado !== 'APROBADO_Y_FIRMADO') {
      throw new DomainError('CONFLICT', 'Solo se pueden devolver equipos de un préstamo aprobado.');
    }
    const returned = this.loanRepository.returnAllEquipment(loan.id);
    if (returned.length === 0) {
      throw new DomainError('CONFLICT', 'El préstamo no tiene equipos pendientes de devolución.');
    }
    return this.getById(String(loan.id));
  }

  private requireUser(id: string, expectedRole: 'INSTRUCTOR' | 'GUARDA'): User {
    const user = this.userRepository.findById(id.toLowerCase());
    if (!user) throw new DomainError('NOT_FOUND', `No existe el usuario ${id}.`);
    if (!user.activo) throw new DomainError('CONFLICT', 'No se pueden asignar préstamos a usuarios inactivos.');
    if (user.rol !== expectedRole) {
      throw new DomainError('CONFLICT', `El usuario ${id} debe tener el rol ${expectedRole}.`);
    }
    return user;
  }

  private validateUuid(value: string, field: string): void {
    if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
      throw new DomainError('VALIDATION_ERROR', `${field} debe ser un UUID válido.`);
    }
  }

  private positiveId(value: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
      throw new DomainError('VALIDATION_ERROR', 'El identificador del préstamo debe ser un entero positivo.');
    }
    return id;
  }
}