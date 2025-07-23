import type { HttpContext } from '@adonisjs/core/http'
import GroupChallenge from '#models/group_challenge'
import GroupChallengeParticipant from '#models/group_challenge_participant'
import { createGroupChallengeValidator } from '#validators/group_challenge'

export default class GroupChallengeController {
  async store({ request, response, auth }: HttpContext) {
    const { challengeId, groupName } = await request.validateUsing(createGroupChallengeValidator)
    const group = await GroupChallenge.create({
      challengeId,
      groupName,
      createdBy: auth.user!.id,
    })
    await GroupChallengeParticipant.create({
      groupChallengeId: group.id,
      userId: auth.user!.id,
    })
    return response.created(group)
  }

  async join({ params, response, auth }: HttpContext) {
    const groupId = params.id
    const userId = auth.user!.id
    const exists = await GroupChallengeParticipant.query()
      .where('groupChallengeId', groupId)
      .andWhere('userId', userId)
      .first()
    if (exists) return response.conflict({ message: 'Already joined' })
    await GroupChallengeParticipant.create({
      groupChallengeId: groupId,
      userId: userId,
    })
    return response.ok({ message: 'Joined group challenge' })
  }

  async index({ request, response, auth }: HttpContext) {
    const userId = request.input('userId') || auth.user?.id
    if (!userId) {
      return response.badRequest({ message: 'userId is required or user must be authenticated' })
    }
    const groupLinks = await GroupChallengeParticipant.query().where('userId', userId)
    const groupIds = groupLinks.map((g) => g.groupChallengeId)
    const groups = groupIds.length > 0 ? await GroupChallenge.query().whereIn('id', groupIds) : []
    return response.ok(groups)
  }
}
