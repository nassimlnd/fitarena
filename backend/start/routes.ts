/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const GymController = () => import('#controllers/gym.controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { group } from 'console'
import AuthController from '#controllers/auth.controller'
import ChallengeControllerClient from '#controllers/challenge.controller.client'

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
    router.put('/gym/:id', [GymController, 'update'])
      .as('gym.update')
      .use([middleware.auth(), middleware.gymOwner()])
  })
  .prefix('/api')

router
  .group(() => {
    router
      .post('/login', [AuthController, 'login'])
      .as('auth.login')
    router.post('/register', [AuthController, 'register'])
  })
  .prefix('/api')

router.resource('challenge_clients', ChallengeControllerClient).apiOnly()
