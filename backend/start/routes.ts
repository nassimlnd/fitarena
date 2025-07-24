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
const ChallengeGymController = () => import('#controllers/challenge_gym.controller')
const TrainingSessionController = () => import('#controllers/training_session.controller')
const ChallengeInvitationController = () => import('#controllers/challenge_invitation.controller')
const GroupChallengeController = () => import('#controllers/group_challenge.controller')
const LeaderboardController = () => import('#controllers/leaderboard.controller')
const GamificationController = () => import('#controllers/gamifications_controller')
const ChallengeExploreController = () => import('#controllers/challenge_explore.controller')
const ChallengeController = () => import('#controllers/challenge.controller')
const ExerciseController = () => import('#controllers/exercise.controller')

// Admin controllers
const AdminExerciseController = () => import('#controllers/admin/exercise.controller')
const AdminGymController = () => import('#controllers/admin/gym.controller')
const AdminUserController = () => import('#controllers/admin/user.controller')
const AdminBadgesController = () => import('#controllers/admin/badges_controller')
const AdminRewardsController = () => import('#controllers/admin/rewards_controller')
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

// Gym challenges routes
router
  .group(() => {
    router.get('/gym_challenges', [ChallengeGymController, 'index']).as('gym_challenges.index')
    router.post('/gym_challenges', [ChallengeGymController, 'store']).as('gym_challenges.store')
    router.get('/gym_challenges/:id', [ChallengeGymController, 'show']).as('gym_challenges.show')
    router
      .put('/gym_challenges/:id', [ChallengeGymController, 'update'])
      .as('gym_challenges.update')
    router
      .delete('/gym_challenges/:id', [ChallengeGymController, 'destroy'])
      .as('gym_challenges.destroy')
  })
  .prefix('/api')
  .use([middleware.auth(), middleware.gymOwner()])

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
      .get('/challenge_invitations/sent', [ChallengeInvitationController, 'sent'])
      .use([middleware.auth()])
    router
      .get('/challenge_invitations/received', [ChallengeInvitationController, 'received'])
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
    router.get('/leaderboard/my-rank', [LeaderboardController, 'myRank']).use([middleware.auth()])

    // Challenge exploration routes
    router.get('/challenges/explore/user', [ChallengeExploreController, 'exploreUserChallenges'])
    router.get('/challenges/explore/gym', [ChallengeExploreController, 'exploreGymChallenges'])
    router.get('/challenges/explore/:id', [ChallengeExploreController, 'show'])
    router.get('/challenges/trending', [ChallengeExploreController, 'trending'])
    router
      .get('/challenges/recommended', [ChallengeExploreController, 'recommended'])
      .use([middleware.auth()])
    router.get('/challenges/search', [ChallengeExploreController, 'search'])

    // Challenge participation routes
    router.post('/challenges/:id/start', [ChallengeController, 'start']).use([middleware.auth()])
    router.post('/challenges/:id/claim', [ChallengeController, 'claim']).use([middleware.auth()])
    router
      .get('/challenges/my-participations', [ChallengeController, 'myParticipations'])
      .use([middleware.auth()])
    router.get('/challenges/my-stats', [ChallengeController, 'myStats']).use([middleware.auth()])

    // Public exercise API
    router.get('/exercises', [ExerciseController, 'index'])
    router.get('/exercises/search', [ExerciseController, 'search'])
    router.get('/exercises/muscles', [ExerciseController, 'muscles'])
    router.get('/exercises/muscle/:muscle', [ExerciseController, 'byMuscle'])
    router.get('/exercises/:id', [ExerciseController, 'show'])

    // Gamification routes (selon cahier des charges)
    router
      .get('/gamification/dashboard', [GamificationController, 'dashboard'])
      .use([middleware.auth()])
    router.get('/gamification/badges', [GamificationController, 'badges']).use([middleware.auth()])
    router
      .get('/gamification/my-badges', [GamificationController, 'myBadges'])
      .use([middleware.auth()])
    router
      .get('/gamification/rewards', [GamificationController, 'rewards'])
      .use([middleware.auth()])
    router
      .get('/gamification/my-rewards', [GamificationController, 'myRewards'])
      .use([middleware.auth()])
    router
      .post('/gamification/rewards/:id/claim', [GamificationController, 'claimReward'])
      .use([middleware.auth()])
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
    router.post('/users/:id/activate', [AdminUserController, 'activate'])
    router.delete('/users/:id', [AdminUserController, 'destroy'])

    // Badge management (selon cahier des charges ligne 24-29)
    router.get('/badges', [AdminBadgesController, 'index'])
    router.post('/badges', [AdminBadgesController, 'store'])
    router.get('/badges/:id', [AdminBadgesController, 'show'])
    router.put('/badges/:id', [AdminBadgesController, 'update'])
    router.delete('/badges/:id', [AdminBadgesController, 'destroy'])
    router.post('/badges/award', [AdminBadgesController, 'awardToUser'])
    router.get('/users/:userId/badges', [AdminBadgesController, 'getUserBadges'])

    // Reward management
    router.get('/rewards', [AdminRewardsController, 'index'])
    router.post('/rewards', [AdminRewardsController, 'store'])
    router.get('/rewards/:id', [AdminRewardsController, 'show'])
    router.put('/rewards/:id', [AdminRewardsController, 'update'])
    router.delete('/rewards/:id', [AdminRewardsController, 'destroy'])
    router.get('/users/:userId/rewards', [AdminRewardsController, 'getUserRewards'])
    router.post('/rewards/deactivate', [AdminRewardsController, 'deactivateUserReward'])
  })
  .prefix('/api/admin')
  .use([middleware.auth(), middleware.admin()])
