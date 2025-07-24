import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TrainingSession from '#models/training_session'
import User from '#models/user'
import Challenge from '#models/challenge'
import { DateTime } from 'luxon'

export default class TrainingSessionSeeder extends BaseSeeder {
  async run() {
    // Récupération des utilisateurs
    const thomas = await User.findByOrFail('email', 'thomas.petit@email.fr')
    const marie = await User.findByOrFail('email', 'marie.lefevre@email.fr')
    const antoine = await User.findByOrFail('email', 'antoine.garnier@email.fr')
    const lea = await User.findByOrFail('email', 'lea.bernard@email.fr')
    const nicolas = await User.findByOrFail('email', 'nicolas.laurent@email.fr')
    const emma = await User.findByOrFail('email', 'emma.durand@email.fr')

    // Récupération de quelques défis
    const pompesChallenge = await Challenge.findByOrFail('name', '30 Jours de Pompes')
    const squatChallenge = await Challenge.findByOrFail('name', 'Squat Challenge 21 Jours')
    const cardioChallenge = await Challenge.findByOrFail('name', 'Cardio Blast 14 Jours')
    const coreChallenge = await Challenge.findByOrFail('name', 'Iron Core - Gainage Extrême')

    await TrainingSession.createMany([
      // Sessions de Thomas
      {
        userId: thomas.id,
        challengeId: pompesChallenge.id,
        date: DateTime.now().minus({ days: 1 }),
        duration: 35,
        caloriesBurned: 280,
        metrics: {
          exercices: 'Pompes classiques, pompes inclinées',
          repetitions: 45,
          series: 3,
          notes: 'Bonne progression, forme améliorée',
        },
      },
      {
        userId: thomas.id,
        challengeId: squatChallenge.id,
        date: DateTime.now().minus({ days: 3 }),
        duration: 25,
        caloriesBurned: 195,
        metrics: {
          exercices: 'Squats, fentes',
          repetitions: 80,
          series: 4,
          notes: 'Jambes courbaturées mais ça vaut le coup',
        },
      },

      // Sessions de Marie
      {
        userId: marie.id,
        challengeId: cardioChallenge.id,
        date: DateTime.now().minus({ days: 2 }),
        duration: 40,
        caloriesBurned: 420,
        metrics: {
          exercices: 'Course, burpees, jumping jacks',
          distance: 4.5,
          unite: 'km',
          notes: 'Session intensive, très motivante',
        },
      },
      {
        userId: marie.id,
        challengeId: null,
        date: DateTime.now().minus({ days: 5 }),
        duration: 60,
        caloriesBurned: 350,
        metrics: {
          exercices: 'Yoga, étirements',
          notes: 'Session récupération après marathon training',
        },
      },

      // Sessions d'Antoine
      {
        userId: antoine.id,
        challengeId: coreChallenge.id,
        date: DateTime.now(),
        duration: 20,
        caloriesBurned: 150,
        metrics: {
          exercices: 'Planche, mountain climbers, russian twists',
          duree_planche: '2 minutes 30',
          notes: 'Nouveau record personnel sur la planche !',
        },
      },
      {
        userId: antoine.id,
        challengeId: pompesChallenge.id,
        date: DateTime.now().minus({ days: 4 }),
        duration: 15,
        caloriesBurned: 120,
        metrics: {
          exercices: 'Pompes rapides',
          repetitions: 30,
          series: 2,
          notes: 'Session express entre les cours',
        },
      },

      // Sessions de Léa
      {
        userId: lea.id,
        challengeId: squatChallenge.id,
        date: DateTime.now().minus({ days: 1 }),
        duration: 50,
        caloriesBurned: 380,
        metrics: {
          exercices: 'Squats, hip thrust, leg curl',
          repetitions: 120,
          series: 5,
          notes: 'Focus sur les fessiers, excellent ressenti',
        },
      },
      {
        userId: lea.id,
        challengeId: cardioChallenge.id,
        date: DateTime.now().minus({ days: 6 }),
        duration: 45,
        caloriesBurned: 450,
        metrics: {
          exercices: 'HIIT, vélo elliptique',
          notes: 'Session cardio très intense, bien suée',
        },
      },

      // Sessions de Nicolas
      {
        userId: nicolas.id,
        challengeId: coreChallenge.id,
        date: DateTime.now().minus({ days: 2 }),
        duration: 30,
        caloriesBurned: 200,
        metrics: {
          exercices: 'Gainage complet, abdos',
          duree_planche: '1 minute 45',
          notes: 'Progression constante sur la planche',
        },
      },
      {
        userId: nicolas.id,
        challengeId: null,
        date: DateTime.now().minus({ days: 7 }),
        duration: 75,
        caloriesBurned: 520,
        metrics: {
          exercices: 'Musculation complète',
          notes: 'Session libre en salle, excellent entraînement',
        },
      },

      // Sessions d'Emma
      {
        userId: emma.id,
        challengeId: pompesChallenge.id,
        date: DateTime.now().minus({ days: 3 }),
        duration: 40,
        caloriesBurned: 320,
        metrics: {
          exercices: 'Pompes variées, dips',
          repetitions: 60,
          series: 4,
          notes: 'Défi pompes bien avancé, force en hausse',
        },
      },
      {
        userId: emma.id,
        challengeId: cardioChallenge.id,
        date: DateTime.now().minus({ days: 8 }),
        duration: 35,
        caloriesBurned: 385,
        metrics: {
          exercices: 'Course interval training',
          distance: 5,
          unite: 'km',
          notes: 'Excellent rythme maintenu',
        },
      },
    ])

    console.log("✅ Sessions d'entraînement créées avec succès")
  }
}
