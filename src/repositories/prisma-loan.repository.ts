import type { PrismaClient } from "../generated/prisma/client.js";
import type { ICreateLoanDTO } from "../dtos/loan.dto.js";
import type { Loan, LoanFilters, LoanRepository, LoanStatus } from "./loan.repository.js";

type LoanRow = {
  id: bigint;
  roomId: string;
  instructorId: string;
  guardaId: string;
  numeroPc: number;
  estado: string;
  createdAt: Date;
  acceptedAt: Date | null;
};

export class PrismaLoanRepository implements LoanRepository {
  constructor(private readonly database: PrismaClient) {}

  async create(input: ICreateLoanDTO): Promise<Loan> {
    const row = await this.database.loan.create({
      data: {
        roomId: input.roomId,
        instructorId: input.instructorId,
        guardaId: input.guardaId,
        numeroPc: input.numeroPc
      }
    });
    return this.toDomain(row);
  }

  async findAll(filters: LoanFilters = {}): Promise<Loan[]> {
    const rows = await this.database.loan.findMany({
      where: filters.roomId ? { roomId: filters.roomId } : undefined,
      orderBy: { createdAt: "desc" }
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<Loan | null> {
    const row = await this.database.loan.findUnique({
      where: { id: BigInt(id) }
    });
    return row ? this.toDomain(row) : null;
  }

  async updateStatus(
    id: string,
    expectedStatus: LoanStatus,
    status: LoanStatus
  ): Promise<Loan | null> {
    const changed = await this.database.loan.updateMany({
      where: {
        id: BigInt(id),
        estado: expectedStatus
      },
      data: {
        estado: status,
        acceptedAt: status === "APROBADO_Y_FIRMADO" ? new Date() : null
      }
    });

    if (changed.count === 0) return null;
    return this.findById(id);
  }

  private toDomain(row: LoanRow): Loan {
    return {
      id: row.id.toString(),
      roomId: row.roomId,
      instructorId: row.instructorId,
      guardaId: row.guardaId,
      numeroPc: row.numeroPc,
      estado: row.estado as LoanStatus,
      createdAt: row.createdAt.toISOString(),
      acceptedAt: row.acceptedAt ? row.acceptedAt.toISOString() : null
    };
  }
}