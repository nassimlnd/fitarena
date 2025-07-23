import type { HttpContext } from '@adonisjs/core/http'
import Challenge from '#models/challengeclient'

export default class ChallengeController {
  async index({ response }: HttpContext) {
    const challenges = await Challenge.all()
    return response.ok(challenges)
  }

  async show({ params, response }: HttpContext) {
    const challenge = await Challenge.find(params.id)
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
    data.creator_id = auth.user?.id || 1
    const challenge = await Challenge.create(data)
    return response.created(challenge)
  }

  async update({ params, request, response }: HttpContext) {
    const challenge = await Challenge.find(params.id)
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
    const challenge = await Challenge.find(params.id)
    if (!challenge) {
      return response.notFound({ message: 'Challenge not found' })
    }
    await challenge.delete()
    return response.noContent()
  }
}
