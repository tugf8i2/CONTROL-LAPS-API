import type { User } from '../models/entities';
import type { Repository } from './repository';

export type UserRepository = Repository<User>;