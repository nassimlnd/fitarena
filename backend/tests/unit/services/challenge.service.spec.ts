import { test } from '@japa/runner'
import { ChallengeService } from '../../../app/services/challenge_service.js'

test.group('ChallengeService', () => {
  test('should create an instance', ({ assert }) => {
    const challengeService = new ChallengeService()
    assert.instanceOf(challengeService, ChallengeService)
  })

  test('should validate user challenge data', ({ assert }) => {
    const challengeService = new ChallengeService()

    // Test valid data - should not throw
    assert.doesNotThrow(() => {
      ;(challengeService as any).validateUserChallengeData({
        name: 'Test Challenge',
        description: 'A test challenge for fitness',
        objectives: 'Complete 100 push-ups',
        duration: 7,
      })
    })
  })

  test('should reject invalid user challenge data', ({ assert }) => {
    const challengeService = new ChallengeService()

    // Test invalid name
    assert.throws(() => {
      ;(challengeService as any).validateUserChallengeData({
        name: 'TC', // Too short
        description: 'A test challenge for fitness',
        objectives: 'Complete 100 push-ups',
        duration: 7,
      })
    }, 'Challenge name must be at least 3 characters')

    // Test invalid description
    assert.throws(() => {
      ;(challengeService as any).validateUserChallengeData({
        name: 'Test Challenge',
        description: 'Short', // Too short
        objectives: 'Complete 100 push-ups',
        duration: 7,
      })
    }, 'Challenge description must be at least 10 characters')

    // Test invalid duration
    assert.throws(() => {
      ;(challengeService as any).validateUserChallengeData({
        name: 'Test Challenge',
        description: 'A test challenge for fitness',
        objectives: 'Complete 100 push-ups',
        duration: 0, // Invalid duration
      })
    }, 'Challenge duration must be at least 1 day')
  })

  test('should format challenge data correctly', ({ assert }) => {
    const challengeService = new ChallengeService()

    const mockChallenge = {
      id: 1,
      name: 'Test Challenge',
      description: 'Test description',
      objectives: 'Test objectives',
      recommendedExercises: 'Push-ups, Squats',
      duration: 7,
      difficulty: 'medium',
      isPublic: true,
      type: 'fitness',
      score: 100,
      gymId: null,
      creatorId: 1,
      creatorType: 'user',
      createdAt: { toISO: () => '2024-01-01T00:00:00.000Z' },
      updatedAt: { toISO: () => '2024-01-01T00:00:00.000Z' },
    }

    const formatted = (challengeService as any).formatChallengeData(mockChallenge)

    assert.equal(formatted.id, 1)
    assert.equal(formatted.name, 'Test Challenge')
    assert.equal(formatted.difficulty, 'medium')
    assert.equal(formatted.isPublic, true)
    assert.equal(formatted.creatorType, 'user')
    assert.equal(formatted.score, 100)
  })
})
