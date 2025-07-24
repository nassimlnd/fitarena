export interface CreateExerciseData {
  name: string
  description: string
  muscles: string[]
}

export interface UpdateExerciseData {
  name?: string
  description?: string
  muscles?: string[]
}
