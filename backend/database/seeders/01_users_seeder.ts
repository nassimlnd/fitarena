import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UsersSeeder extends BaseSeeder {
  async run() {
    // Admin utilisateur
    await User.create({
      fullName: 'Alexandre Martin',
      email: 'admin@fitarena.fr',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      totalPoints: 50000,
      availablePoints: 25000,
      level: 15,
      experiencePoints: 45000,
      achievementsProgress: {
        challenges_completed: { current: 50, target: 100 },
        gym_visits: { current: 200, target: 365 },
        streak_days: { current: 45, target: 30 },
      },
    })

    // Propriétaires de salles
    await User.createMany([
      {
        fullName: 'Sophie Dubois',
        email: 'sophie.dubois@powergym.fr',
        password: 'password123',
        role: 'gymOwner',
        isActive: true,
        totalPoints: 35000,
        availablePoints: 18000,
        level: 12,
        experiencePoints: 32000,
        achievementsProgress: {
          challenges_completed: { current: 30, target: 50 },
          gym_visits: { current: 150, target: 200 },
        },
      },
      {
        fullName: 'Julien Moreau',
        email: 'julien.moreau@fitclub.fr',
        password: 'password123',
        role: 'gymOwner',
        isActive: true,
        totalPoints: 28000,
        availablePoints: 15000,
        level: 10,
        experiencePoints: 25000,
        achievementsProgress: {
          challenges_completed: { current: 25, target: 50 },
          points_earned: { current: 28000, target: 30000 },
        },
      },
      {
        fullName: 'Camille Rousseau',
        email: 'camille.rousseau@zenfit.fr',
        password: 'password123',
        role: 'gymOwner',
        isActive: true,
        totalPoints: 42000,
        availablePoints: 20000,
        level: 14,
        experiencePoints: 38000,
        achievementsProgress: {
          challenges_completed: { current: 40, target: 50 },
          streak_days: { current: 60, target: 100 },
        },
      },
    ])

    // Utilisateurs réguliers
    await User.createMany([
      {
        fullName: 'Thomas Petit',
        email: 'thomas.petit@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 8500,
        availablePoints: 4200,
        level: 5,
        experiencePoints: 7200,
        achievementsProgress: {
          challenges_completed: { current: 8, target: 10 },
          gym_visits: { current: 25, target: 50 },
        },
      },
      {
        fullName: 'Marie Lefevre',
        email: 'marie.lefevre@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 12000,
        availablePoints: 6000,
        level: 7,
        experiencePoints: 11500,
        achievementsProgress: {
          challenges_completed: { current: 12, target: 20 },
          points_earned: { current: 12000, target: 15000 },
        },
      },
      {
        fullName: 'Antoine Garnier',
        email: 'antoine.garnier@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 6800,
        availablePoints: 3400,
        level: 4,
        experiencePoints: 5800,
        achievementsProgress: {
          challenges_completed: { current: 5, target: 10 },
          streak_days: { current: 15, target: 30 },
        },
      },
      {
        fullName: 'Léa Bernard',
        email: 'lea.bernard@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 15200,
        availablePoints: 7600,
        level: 8,
        experiencePoints: 14800,
        achievementsProgress: {
          challenges_completed: { current: 15, target: 20 },
          gym_visits: { current: 80, target: 100 },
        },
      },
      {
        fullName: 'Nicolas Laurent',
        email: 'nicolas.laurent@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 9800,
        availablePoints: 4900,
        level: 6,
        experiencePoints: 9200,
        achievementsProgress: {
          challenges_completed: { current: 9, target: 15 },
          points_earned: { current: 9800, target: 12000 },
        },
      },
      {
        fullName: 'Emma Durand',
        email: 'emma.durand@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 18500,
        availablePoints: 9250,
        level: 9,
        experiencePoints: 17200,
        achievementsProgress: {
          challenges_completed: { current: 18, target: 25 },
          streak_days: { current: 40, target: 50 },
        },
      },
      {
        fullName: 'Lucas Simon',
        email: 'lucas.simon@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 5200,
        availablePoints: 2600,
        level: 3,
        experiencePoints: 4500,
        achievementsProgress: {
          challenges_completed: { current: 3, target: 5 },
          gym_visits: { current: 12, target: 25 },
        },
      },
      {
        fullName: 'Chloé Michel',
        email: 'chloe.michel@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 22000,
        availablePoints: 11000,
        level: 11,
        experiencePoints: 21500,
        achievementsProgress: {
          challenges_completed: { current: 22, target: 30 },
          points_earned: { current: 22000, target: 25000 },
        },
      },
      {
        fullName: 'Maxime Garcia',
        email: 'maxime.garcia@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 7400,
        availablePoints: 3700,
        level: 4,
        experiencePoints: 6900,
        achievementsProgress: {
          challenges_completed: { current: 6, target: 10 },
          streak_days: { current: 20, target: 30 },
        },
      },
      {
        fullName: 'Manon Roux',
        email: 'manon.roux@email.fr',
        password: 'password123',
        role: 'user',
        isActive: true,
        totalPoints: 13800,
        availablePoints: 6900,
        level: 7,
        experiencePoints: 13200,
        achievementsProgress: {
          challenges_completed: { current: 13, target: 20 },
          gym_visits: { current: 65, target: 100 },
        },
      },
    ])

    console.log('✅ Utilisateurs créés avec succès')
  }
}
