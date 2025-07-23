import { FilterOptions, PaginationOptions } from '../types/common_types.js'

export interface BaseRepositoryInterface<T, CreateData, UpdateData> {
  create(data: CreateData): Promise<T>
  findById(id: number): Promise<T | null>
  findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<T[]>
  update(id: number, data: UpdateData): Promise<T | null>
  delete(id: number): Promise<boolean>
}
