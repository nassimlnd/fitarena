export interface CreateExerciseDTO {
  name: string
  description: string
  muscles: string[]
}

export interface UpdateExerciseDTO {
  name?: string
  description?: string
  muscles?: string[]
}

export interface ExerciseData {
  id: number
  name: string
  description: string
  muscles: string[]
  createdAt: string
  updatedAt: string
}

export interface ExerciseFilterOptions {
  search?: string
}
