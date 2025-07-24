import { test } from '@japa/runner'
import { ExerciseService } from '../../../app/services/exercise.service.js'

test.group('ExerciseService', () => {
  test('should create an instance', ({ assert }) => {
    const exerciseService = new ExerciseService()
    assert.instanceOf(exerciseService, ExerciseService)
  })

  test('should format exercise data correctly', async ({ assert }) => {
    const exerciseService = new ExerciseService()

    // Mock exercise data
    const mockExercise = {
      id: 1,
      name: 'Push-ups',
      description: 'Classic bodyweight exercise',
      muscles: ['chest', 'triceps', 'shoulders'],
      createdAt: { toISO: () => '2024-01-01T00:00:00.000Z' },
      updatedAt: { toISO: () => '2024-01-01T00:00:00.000Z' },
    }

    // Access private method for testing (in real scenario, you'd test through public methods)
    const formatted = (exerciseService as any).toExerciseData(mockExercise)

    assert.equal(formatted.id, 1)
    assert.equal(formatted.name, 'Push-ups')
    assert.equal(formatted.description, 'Classic bodyweight exercise')
    assert.deepEqual(formatted.muscles, ['chest', 'triceps', 'shoulders'])
    assert.equal(formatted.createdAt, '2024-01-01T00:00:00.000Z')
    assert.equal(formatted.updatedAt, '2024-01-01T00:00:00.000Z')
  })
})
