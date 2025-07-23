import type { HttpContext } from '@adonisjs/core/http'
import ChallengeInvitation from '#models/challenge_invitation'

export default class ChallengeInvitationController {
  async store({ request, response, auth }: HttpContext) {
    const { invitee_id, challenge_id } = request.only(['invitee_id', 'challenge_id'])
    const invite = await ChallengeInvitation.create({
      inviter_id: auth.user!.id,
      invitee_id,
      challenge_id,
      status: 'pending',
    })

    return response.created(invite)
  }

  async index({ request, response, auth }: HttpContext) {
    const userId = request.input('user_id') || auth.user?.id

    if (!userId) {
      return response.badRequest({ message: 'user_id is required or user must be authenticated' })
    }

    const invites = await ChallengeInvitation.query()
      .where('invitee_id', userId)
      .orWhere('inviter_id', userId)

    return response.ok(invites)
  }

  async respond({ params, request, response, auth }: HttpContext) {
    const { id } = params
    const { status } = request.only(['status'])
    const userId = auth.user!.id
    const invite = await ChallengeInvitation.find(id)

    if (!invite) return response.notFound({ message: 'Invitation not found' })

    if (invite.invitee_id !== userId) {
      return response.forbidden({ message: 'Not your invitation' })
    }

    if (!['accepted', 'declined'].includes(status)) {
      return response.badRequest({ message: 'Invalid status' })
    }

    invite.status = status
    await invite.save()

    return response.ok(invite)
  }
}
