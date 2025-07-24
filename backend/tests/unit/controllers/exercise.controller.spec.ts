import { test } from '@japa/runner'
import ExerciseController from '../../../app/controllers/exercise.controller.js'

test.group('ExerciseController', () => {
  test('should create an instance', ({ assert }) => {
    const controller = new ExerciseController()
    assert.instanceOf(controller, ExerciseController)
  })

  test('should have all required methods', ({ assert }) => {
    const controller = new ExerciseController()

    assert.isFunction(controller.index)
    assert.isFunction(controller.show)
    assert.isFunction(controller.byMuscle)
    assert.isFunction(controller.muscles)
    assert.isFunction(controller.search)
  })
})
