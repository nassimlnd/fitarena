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
      .use([middleware.auth(), middleware.admin()])
    router.get('/gyms', [GymController, 'list']).as('gym.list')
  })
  .prefix('/api')
