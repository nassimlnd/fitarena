/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const GymController = () => import('#controllers/gym.controller')
const AuthController = () => import('#controllers/auth.controller')
const ChallengeControllerClient = () => import('#controllers/challenge.controller.client')
const TrainingSessionController = () => import('#controllers/training_session.controller')
const ChallengeInvitationController = () => import('#controllers/challenge_invitation.controller')
const GroupChallengeController = () => import('#controllers/group_challenge.controller')
const LeaderboardController = () => import('#controllers/leaderboard.controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .post('/gym', [GymController, 'store'])
      .as('gym.store')
      .use([middleware.auth(), middleware.gymOwner()])
    router.get('/gyms', [GymController, 'list']).as('gym.list')
    router
      .put('/gym/:id', [GymController, 'update'])
      .as('gym.update')
      .use([middleware.auth(), middleware.gymOwner()])
  })
  .prefix('/api')

router
  .group(() => {
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.post('/register', [AuthController, 'register'])
  })
  .prefix('/api')

router
  .group(() => {
    router.get('/challenge_clients', [ChallengeControllerClient, 'index'])
    router.get('/challenge_clients/:id', [ChallengeControllerClient, 'show'])
    router.post('/challenge_clients', [ChallengeControllerClient, 'store'])
    router.put('/challenge_clients/:id', [ChallengeControllerClient, 'update'])
    router.delete('/challenge_clients/:id', [ChallengeControllerClient, 'destroy'])
  })
  .prefix('/api')

router
  .group(() => {
    router.post('/training_sessions', [TrainingSessionController, 'store']).use([middleware.auth()])
    router.get('/training_sessions', [TrainingSessionController, 'index']).use([middleware.auth()])
    router.get('/training_stats', [TrainingSessionController, 'stats']).use([middleware.auth()])
  })
  .prefix('/api')

router
  .group(() => {
    router
      .post('/challenge_invitations', [ChallengeInvitationController, 'store'])
      .use([middleware.auth()])
    router
      .get('/challenge_invitations', [ChallengeInvitationController, 'index'])
      .use([middleware.auth()])
    router
      .post('/challenge_invitations/:id/respond', [ChallengeInvitationController, 'respond'])
      .use([middleware.auth()])

    router.post('/group_challenges', [GroupChallengeController, 'store']).use([middleware.auth()])
    router
      .post('/group_challenges/:id/join', [GroupChallengeController, 'join'])
      .use([middleware.auth()])
    router.get('/group_challenges', [GroupChallengeController, 'index']).use([middleware.auth()])

    router.get('/leaderboard', [LeaderboardController, 'index'])
  })
  .prefix('/api')
