import Gym from '#models/gym'

export default class GymSeeder {
  public async run() {
    await Gym.createMany([
      {
        name: 'Downtown Fitness',
        contact: '123-456-7890',
        description: 'A modern gym in the city center.',
      },
      {
        name: 'Neighborhood Gym',
        contact: '987-654-3210',
        description: 'A friendly local gym.',
      },
    ])
  }
}
