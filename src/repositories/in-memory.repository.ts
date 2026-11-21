import { randomUUID } from 'node:crypto';
import type { Entity } from '../models/entities';
import type { Repository } from './repository';

export class InMemoryRepository<T extends Entity> implements Repository<T> {
  private readonly items = new Map<string, T>();
  private nextId = 1;

  constructor(private readonly numericIds = false) {}

  create(input: Omit<T, 'id'>): T {
    const id = (this.numericIds ? this.nextId++ : randomUUID()) as unknown as T['id'];
    const item = { ...structuredClone(input), id } as T;
    this.items.set(String(id), item);
    return structuredClone(item);
  }

  findAll(filters: Partial<Omit<T, 'id'>> = {}): T[] {
    const entries = Object.entries(filters);
    return [...this.items.values()]
      .filter((item) => entries.every(([key, value]) =>
        value === undefined || (item as unknown as Record<string, unknown>)[key] === value
      ))
      .map((item) => structuredClone(item));
  }

  findById(id: T['id']): T | null {
    const item = this.items.get(String(id));
    return item ? structuredClone(item) : null;
  }

  update(id: T['id'], changes: Partial<Omit<T, 'id'>>): T | null {
    const current = this.items.get(String(id));
    if (!current) return null;
    const updated = { ...current, ...structuredClone(changes), id: current.id } as T;
    this.items.set(String(id), updated);
    return structuredClone(updated);
  }
}