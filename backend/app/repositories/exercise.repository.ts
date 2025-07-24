import Exercise from '#models/exercise'
import { BaseRepositoryInterface } from './base_repository.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'
import { CreateExerciseData, UpdateExerciseData } from '../types/repositories/exercise.types.js'

export class ExerciseRepository
  implements BaseRepositoryInterface<Exercise, CreateExerciseData, UpdateExerciseData>
{
  async create(data: CreateExerciseData): Promise<Exercise> {
    return await Exercise.create(data)
  }

  async findById(id: number): Promise<Exercise | null> {
    try {
      return await Exercise.findOrFail(id)
    } catch {
      return null
    }
  }

  async findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<Exercise[]> {
    const query = Exercise.query()

    if (filters?.search) {
      query
        .where('name', 'like', `%${filters.search}%`)
        .orWhere('description', 'like', `%${filters.search}%`)
    }

    if (pagination?.limit) {
      query.limit(pagination.limit)
    }

    if (pagination?.offset) {
      query.offset(pagination.offset)
    }

    return await query.exec()
  }

  async findAll(): Promise<Exercise[]> {
    return await Exercise.all()
  }

  async update(id: number, data: UpdateExerciseData): Promise<Exercise | null> {
    try {
      const exercise = await Exercise.findOrFail(id)
      exercise.merge(data)
      await exercise.save()
      return exercise
    } catch {
      return null
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const exercise = await Exercise.findOrFail(id)
      await exercise.delete()
      return true
    } catch {
      return false
    }
  }
}
