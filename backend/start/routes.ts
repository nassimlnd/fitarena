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
const ChallengeClientController = () => import('#controllers/challenge_client.controller')
const TrainingSessionController = () => import('#controllers/training_session.controller')
const ChallengeInvitationController = () => import('#controllers/challenge_invitation.controller')
const GroupChallengeController = () => import('#controllers/group_challenge.controller')
const LeaderboardController = () => import('#controllers/leaderboard.controller')

// Admin controllers
const AdminExerciseController = () => import('#controllers/admin/exercise.controller')
const AdminGymController = () => import('#controllers/admin/gym.controller')
const AdminUserController = () => import('#controllers/admin/user.controller')
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
    router.get('/challenge_clients', [ChallengeClientController, 'index'])
    router.get('/challenge_clients/:id', [ChallengeClientController, 'show'])
    router.post('/challenge_clients', [ChallengeClientController, 'store']).use([middleware.auth()])
    router
      .put('/challenge_clients/:id', [ChallengeClientController, 'update'])
      .use([middleware.auth()])
    router
      .delete('/challenge_clients/:id', [ChallengeClientController, 'destroy'])
      .use([middleware.auth()])
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

// Admin routes
router
  .group(() => {
    // Exercise management
    router.get('/exercises', [AdminExerciseController, 'index'])
    router.post('/exercises', [AdminExerciseController, 'store'])
    router.get('/exercises/:id', [AdminExerciseController, 'show'])
    router.put('/exercises/:id', [AdminExerciseController, 'update'])
    router.delete('/exercises/:id', [AdminExerciseController, 'destroy'])

    // Gym management
    router.get('/gyms', [AdminGymController, 'index'])
    router.get('/gyms/pending', [AdminGymController, 'pending'])
    router.get('/gyms/:id', [AdminGymController, 'show'])
    router.post('/gyms/:id/approve', [AdminGymController, 'approve'])
    router.post('/gyms/:id/reject', [AdminGymController, 'reject'])
    router.delete('/gyms/:id', [AdminGymController, 'destroy'])

    // User management
    router.get('/users', [AdminUserController, 'index'])
    router.get('/users/:id', [AdminUserController, 'show'])
    router.put('/users/:id/role', [AdminUserController, 'updateRole'])
    router.post('/users/:id/deactivate', [AdminUserController, 'deactivate'])
    router.delete('/users/:id', [AdminUserController, 'destroy'])
  })
  .prefix('/api/admin')
  .use([middleware.admin()])
