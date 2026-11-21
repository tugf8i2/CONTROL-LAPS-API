import type { Loan, LoanEquipment, LoanStatus, LoanWithEquipment } from '../models/entities';
import { DomainError } from '../errors/domain.error';
import type { LoanRepository } from './loan.repository';

export class InMemoryLoanRepository implements LoanRepository {
  private readonly loans = new Map<number, Loan>();
  private readonly assignments = new Map<string, LoanEquipment>();
  private nextId = 1;

  createWithEquipment(
    input: Omit<Loan, 'id' | 'estado' | 'createdAt' | 'acceptedAt'>,
    equipmentIds: string[]
  ): LoanWithEquipment {
    const uniqueIds = [...new Set(equipmentIds)];
    if (uniqueIds.length !== equipmentIds.length) {
      throw new DomainError('VALIDATION_ERROR', 'La lista de equipos contiene identificadores repetidos.');
    }
    const activeIds = new Set(this.getActiveEquipmentIds());
    if (uniqueIds.some((id) => activeIds.has(id))) {
      throw new DomainError('CONFLICT', 'Uno o más equipos ya están asignados a un préstamo activo.');
    }

    const now = new Date().toISOString();
    const loan: Loan = {
      ...input,
      id: this.nextId++,
      estado: 'PENDIENTE_APROBACION',
      createdAt: now,
      acceptedAt: null
    };
    this.loans.set(loan.id, loan);

    for (const equipmentId of uniqueIds) {
      const assignment: LoanEquipment = {
        loanId: loan.id,
        equipmentId,
        assignedAt: now,
        returnedAt: null
      };
      this.assignments.set(this.assignmentKey(loan.id, equipmentId), assignment);
    }

    return this.withEquipment(loan);
  }

  findAllWithEquipment(filters: { roomId?: string } = {}): LoanWithEquipment[] {
    return [...this.loans.values()]
      .filter((loan) => filters.roomId === undefined || loan.roomId === filters.roomId)
      .map((loan) => this.withEquipment(loan));
  }

  findById(id: number): Loan | null {
    const loan = this.loans.get(id);
    return loan ? structuredClone(loan) : null;
  }

  findByIdWithEquipment(id: number): LoanWithEquipment | null {
    const loan = this.loans.get(id);
    return loan ? this.withEquipment(loan) : null;
  }

  updateStatus(id: number, expectedStatus: LoanStatus, status: LoanStatus): LoanWithEquipment | null {
    const current = this.loans.get(id);
    if (!current || current.estado !== expectedStatus) return null;
    const updated: Loan = {
      ...current,
      estado: status,
      acceptedAt: status === 'APROBADO_Y_FIRMADO' ? new Date().toISOString() : current.acceptedAt
    };
    this.loans.set(id, updated);
    return this.withEquipment(updated);
  }

  getActiveEquipmentIds(): string[] {
    return [...this.assignments.values()]
      .filter((assignment) => assignment.returnedAt === null)
      .map((assignment) => assignment.equipmentId);
  }

  returnEquipment(loanId: number, equipmentId: string): { loanId: number; equipmentId: string; assignedAt: string; returnedAt: string } | null {
    const key = this.assignmentKey(loanId, equipmentId);
    const current = this.assignments.get(key);
    if (!current || current.returnedAt !== null) return null;
    const updated = { ...current, returnedAt: new Date().toISOString() };
    this.assignments.set(key, updated);
    return updated;
  }

  returnAllEquipment(loanId: number): Array<{ loanId: number; equipmentId: string; assignedAt: string; returnedAt: string }> {
    const returned = [];
    for (const [key, current] of this.assignments.entries()) {
      if (current.loanId === loanId && current.returnedAt === null) {
        const updated = { ...current, returnedAt: new Date().toISOString() };
        this.assignments.set(key, updated);
        returned.push(updated);
      }
    }
    return returned;
  }

  getAssignments(loanId: number): LoanEquipment[] {
    return [...this.assignments.values()]
      .filter((assignment) => assignment.loanId === loanId)
      .map((assignment) => structuredClone(assignment));
  }

  private withEquipment(loan: Loan): LoanWithEquipment {
    return { ...structuredClone(loan), equipment: this.getAssignments(loan.id) };
  }

  private assignmentKey(loanId: number, equipmentId: string): string {
    return `${loanId}:${equipmentId}`;
  }
}