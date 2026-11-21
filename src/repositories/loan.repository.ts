import type { Loan, LoanStatus, LoanWithEquipment } from '../models/entities';

export interface LoanRepository {
  createWithEquipment(
    input: Omit<Loan, 'id' | 'estado' | 'createdAt' | 'acceptedAt'>,
    equipmentIds: string[]
  ): LoanWithEquipment;
  findAllWithEquipment(filters?: { roomId?: string }): LoanWithEquipment[];
  findById(id: number): Loan | null;
  findByIdWithEquipment(id: number): LoanWithEquipment | null;
  updateStatus(id: number, expectedStatus: LoanStatus, status: LoanStatus): LoanWithEquipment | null;
  getActiveEquipmentIds(): string[];
  returnEquipment(loanId: number, equipmentId: string): { loanId: number; equipmentId: string; assignedAt: string; returnedAt: string } | null;
  returnAllEquipment(loanId: number): Array<{ loanId: number; equipmentId: string; assignedAt: string; returnedAt: string }>;
  getAssignments(loanId: number): Array<{ loanId: number; equipmentId: string; assignedAt: string; returnedAt: string | null }>;
}