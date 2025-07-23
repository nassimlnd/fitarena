import type { HttpContext } from '@adonisjs/core/http'
import ChallengeClient from '#models/challengeclient'

export default class ChallengeControllerClient {
  async index({ request, response }: HttpContext) {
    const { difficulty, type, minDuration, maxDuration } = request.qs()
    const query = ChallengeClient.query().where('is_public', true)

    if (difficulty) query.where('difficulty', difficulty)

    if (type) query.where('type', type)

    if (minDuration) query.where('duration', '>=', Number(minDuration))

    if (maxDuration) query.where('duration', '<=', Number(maxDuration))

    const challenges = await query

    return response.ok(challenges)
  }

  async show({ params, response }: HttpContext) {
    const challenge = await ChallengeClient.find(params.id)

    if (!challenge) {
      return response.notFound({ message: 'Challenge not found' })
    }

    return response.ok(challenge)
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.only([
      'title',
      'description',
      'objectives',
      'recommended_exercises',
      'duration',
      'difficulty',
      'is_public',
      'type',
      'creator_id',
    ])

    data.creator_id = auth.user?.id
    const challenge = await ChallengeClient.create(data)

    return response.created(challenge)
  }

  async update({ params, request, response }: HttpContext) {
    const challenge = await ChallengeClient.find(params.id)

    if (!challenge) {
      return response.notFound({ message: 'Challenge not found' })
    }

    const data = request.only([
      'title',
      'description',
      'objectives',
      'recommended_exercises',
      'duration',
      'difficulty',
      'is_public',
      'type',
      'creator_id',
    ])

    challenge.merge(data)
    await challenge.save()

    return response.ok(challenge)
  }

  async destroy({ params, response }: HttpContext) {
    const challenge = await ChallengeClient.find(params.id)

    if (!challenge) {
      return response.notFound({ message: 'Challenge not found' })
    }

    await challenge.delete()

    return response.noContent()
  }
}
