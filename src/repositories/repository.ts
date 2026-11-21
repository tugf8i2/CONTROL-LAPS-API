import type { Entity } from '../models/entities';

export interface Repository<T extends Entity> {
  create(input: Omit<T, 'id'>): T;
  findAll(filters?: Partial<Omit<T, 'id'>>): T[];
  findById(id: T['id']): T | null;
  update(id: T['id'], changes: Partial<Omit<T, 'id'>>): T | null;
}