import { ExerciseRepository } from '../repositories/exercise.repository.js'
import { CreateExerciseDTO, UpdateExerciseDTO, ExerciseData } from '../types/exercise.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export class ExerciseService {
  private exerciseRepository: ExerciseRepository

  constructor() {
    this.exerciseRepository = new ExerciseRepository()
  }

  async getAllExercises(): Promise<ServiceResponse<ExerciseData[]>> {
    try {
      const exercises = await this.exerciseRepository.findAll()
      return {
        success: true,
        data: exercises.map((exercise) => this.toExerciseData(exercise)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch exercises', 'FETCH_ERROR', 500)
    }
  }

  async createExercise(data: CreateExerciseDTO): Promise<ServiceResponse<ExerciseData>> {
    try {
      const exerciseData = {
        ...data,
        muscles: Array.isArray(data.muscles) ? data.muscles : [data.muscles],
      }

      const exercise = await this.exerciseRepository.create(exerciseData)
      return {
        success: true,
        data: this.toExerciseData(exercise),
      }
    } catch (error) {
      throw new ServiceException('Failed to create exercise', 'CREATE_ERROR', 500)
    }
  }

  async getExerciseById(id: number): Promise<ServiceResponse<ExerciseData>> {
    try {
      const exercise = await this.exerciseRepository.findById(id)
      if (!exercise) {
        throw new ServiceException('Exercise not found', 'NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.toExerciseData(exercise),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to fetch exercise', 'FETCH_ERROR', 500)
    }
  }

  async updateExercise(
    id: number,
    data: UpdateExerciseDTO
  ): Promise<ServiceResponse<ExerciseData>> {
    try {
      const updateData = {
        ...data,
        muscles: data.muscles
          ? Array.isArray(data.muscles)
            ? data.muscles
            : [data.muscles]
          : undefined,
      }

      const exercise = await this.exerciseRepository.update(id, updateData)
      if (!exercise) {
        throw new ServiceException('Exercise not found', 'NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.toExerciseData(exercise),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to update exercise', 'UPDATE_ERROR', 500)
    }
  }

  async deleteExercise(id: number): Promise<ServiceResponse<void>> {
    try {
      const deleted = await this.exerciseRepository.delete(id)
      if (!deleted) {
        throw new ServiceException('Exercise not found', 'NOT_FOUND', 404)
      }

      return {
        success: true,
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to delete exercise', 'DELETE_ERROR', 500)
    }
  }

  private toExerciseData(exercise: any): ExerciseData {
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      muscles: exercise.muscles,
      createdAt: exercise.createdAt.toISO(),
      updatedAt: exercise.updatedAt.toISO(),
    }
  }
}
