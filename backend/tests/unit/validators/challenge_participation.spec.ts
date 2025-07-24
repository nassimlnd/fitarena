import { test } from '@japa/runner'
import { claimChallengeValidator } from '../../../app/validators/challenge_participation.js'

test.group('Challenge Participation Validators', () => {
  test('should validate claim challenge data', async ({ assert }) => {
    const validData = {
      notes: 'Completed all exercises successfully',
      completedAt: new Date('2024-01-15T10:00:00Z'),
    }

    const result = await claimChallengeValidator.validate(validData)
    assert.equal(result.notes, 'Completed all exercises successfully')
    assert.instanceOf(result.completedAt, Date)
  })

  test('should accept empty claim data', async ({ assert }) => {
    const emptyData = {}

    const result = await claimChallengeValidator.validate(emptyData)
    assert.isUndefined(result.notes)
    assert.isUndefined(result.completedAt)
  })

  test('should reject notes that are too long', async ({ assert }) => {
    const invalidData = {
      notes: 'A'.repeat(501), // 501 characters, exceeds 500 limit
    }

    await assert.rejects(
      () => claimChallengeValidator.validate(invalidData),
      'Notes must not exceed 500 characters'
    )
  })
})
