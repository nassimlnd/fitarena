import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Badge from '#models/badge'

export default class extends BaseSeeder {
  async run() {
    // Clear existing badges safely
    await Badge.query().delete()

    // Badges basés sur les accomplissements dans les défis (selon le cahier des charges)
    await Badge.createMany([
      {
        name: 'Premier Défi',
        description: "Complétez votre premier défi d'entraînement",
        icon: '🎯',
        color: '#4CAF50',
        type: 'milestone',
        criteria: {
          type: 'challenges_completed',
          target: 1,
          period: 'all_time',
        },
        points: 0,
      },
      {
        name: 'Défieur',
        description: "Complétez 5 défis d'entraînement",
        icon: '💪',
        color: '#2196F3',
        type: 'achievement',
        criteria: {
          type: 'challenges_completed',
          target: 5,
          period: 'all_time',
        },
        points: 0,
      },
      {
        name: 'Champion des Défis',
        description: "Complétez 20 défis d'entraînement",
        icon: '🏆',
        color: '#FFD700',
        type: 'achievement',
        criteria: {
          type: 'challenges_completed',
          target: 20,
          period: 'all_time',
        },
        points: 0,
      },

      // Badges de sessions d'entraînement
      {
        name: 'Première Session',
        description: "Enregistrez votre première session d'entraînement",
        icon: '🏃',
        color: '#00BCD4',
        type: 'milestone',
        criteria: {
          type: 'training_sessions',
          target: 1,
          period: 'all_time',
        },
        points: 0,
      },
      {
        name: 'Sportif Régulier',
        description: "Enregistrez 10 sessions d'entraînement",
        icon: '📈',
        color: '#9C27B0',
        type: 'achievement',
        criteria: {
          type: 'training_sessions',
          target: 10,
          period: 'all_time',
        },
        points: 0,
      },
      {
        name: 'Athlète Confirmé',
        description: "Enregistrez 50 sessions d'entraînement",
        icon: '🥇',
        color: '#FF9800',
        type: 'achievement',
        criteria: {
          type: 'training_sessions',
          target: 50,
          period: 'all_time',
        },
        points: 0,
      },

      // Badges de performance
      {
        name: 'Brûleur de Calories',
        description: 'Brûlez 500 calories en une session',
        icon: '🔥',
        color: '#F44336',
        type: 'achievement',
        criteria: {
          type: 'calories_burned',
          target: 500,
          period: 'session',
        },
        points: 0,
      },
      {
        name: 'Marathonien',
        description: "Session d'entraînement de plus de 2 heures",
        icon: '⏱️',
        color: '#795548',
        type: 'achievement',
        criteria: {
          type: 'training_duration',
          target: 120,
          period: 'session',
        },
        points: 0,
      },

      // Badges sociaux (défis en groupe)
      {
        name: "Esprit d'Équipe",
        description: 'Participez à votre premier défi de groupe',
        icon: '👥',
        color: '#673AB7',
        type: 'milestone',
        criteria: {
          type: 'group_challenges',
          target: 1,
          period: 'all_time',
        },
        points: 0,
      },
      {
        name: 'Leader',
        description: 'Créez un défi qui inspire 10 participants',
        icon: '👨‍💼',
        color: '#3F51B5',
        type: 'special',
        criteria: {
          type: 'challenge_participants',
          target: 10,
          period: 'all_time',
        },
        points: 0,
      },
    ])

    console.log('✅ Badges seedés avec succès (basés sur accomplissements défis)')
  }
}
