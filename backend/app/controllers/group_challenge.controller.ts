import type { HttpContext } from '@adonisjs/core/http'
import GroupChallenge from '#models/group_challenge'
import GroupChallengeParticipant from '#models/group_challenge_participant'

export default class GroupChallengeController {
  async store({ request, response, auth }: HttpContext) {
    const { challengeId, goupName } = request.only(['challengeId', 'goupName'])
    const group = await GroupChallenge.create({
      challengeId,
      goupName,
      created_by: auth.user!.id,
    })
    await GroupChallengeParticipant.create({
      group_challengeId: group.id,
      user_id: auth.user!.id,
    })
    return response.created(group)
  }

  async join({ params, response, auth }: HttpContext) {
    const groupId = params.id
    const userId = auth.user!.id
    const exists = await GroupChallengeParticipant.query()
      .where('group_challengeId', groupId)
      .andWhere('user_id', userId)
      .first()
    if (exists) return response.conflict({ message: 'Already joined' })
    await GroupChallengeParticipant.create({
      group_challengeId: groupId,
      user_id: userId,
    })
    return response.ok({ message: 'Joined group challenge' })
  }

  async index({ request, response, auth }: HttpContext) {
    const userId = request.input('user_id') || auth.user?.id
    if (!userId) {
      return response.badRequest({ message: 'user_id is required or user must be authenticated' })
    }
    const groupLinks = await GroupChallengeParticipant.query().where('user_id', userId)
    const groupIds = groupLinks.map((g) => g.group_challengeId)
    const groups = groupIds.length > 0 ? await GroupChallenge.query().whereIn('id', groupIds) : []
    return response.ok(groups)
  }
}
