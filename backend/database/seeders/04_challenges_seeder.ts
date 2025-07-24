import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Challenge from '#models/challenge'
import User from '#models/user'
import Gym from '#models/gym'

export default class ChallengesSeeder extends BaseSeeder {
  async run() {
    // Récupération des utilisateurs et salles pour les défis
    const admin = await User.findByOrFail('email', 'admin@fitarena.fr')
    const sophie = await User.findByOrFail('email', 'sophie.dubois@powergym.fr')
    const julien = await User.findByOrFail('email', 'julien.moreau@fitclub.fr')
    const camille = await User.findByOrFail('email', 'camille.rousseau@zenfit.fr')

    const powerGym = await Gym.findByOrFail('name', 'PowerGym Paris')
    const fitClub = await Gym.findByOrFail('name', 'FitClub Lyon')
    const zenFit = await Gym.findByOrFail('name', 'ZenFit Marseille')

    await Challenge.createMany([
      // Défis publics créés par l'admin
      {
        name: '30 Jours de Pompes',
        description:
          'Défi progressif de pompes sur 30 jours pour développer la force du haut du corps',
        objectives:
          "Jour 1: 5 pompes, augmentation progressive jusqu'à 50 pompes le jour 30. Repos tous les 7 jours.",
        recommendedExercises:
          'Pompes classiques, pompes inclinées, pompes sur genoux (adaptation débutant)',
        duration: 30,
        difficulty: 'medium',
        isPublic: true,
        type: 'fitness',
        score: 2850,
        gymId: null,
        creatorId: admin.id,
        creatorType: 'user',
      },
      {
        name: 'Squat Challenge 21 Jours',
        description: 'Renforcez vos jambes et fessiers avec ce défi squat intensif',
        objectives:
          'Progression de 15 à 200 squats sur 21 jours. Programme structuré avec jours de repos.',
        recommendedExercises: 'Squats classiques, squats sumo, squats sautés, fentes',
        duration: 21,
        difficulty: 'medium',
        isPublic: true,
        type: 'fitness',
        score: 3200,
        gymId: null,
        creatorId: admin.id,
        creatorType: 'user',
      },
      {
        name: 'Iron Core - Gainage Extrême',
        description: "Défi ultime pour obtenir des abdominaux d'acier",
        objectives:
          'Planche de 30 secondes à 5 minutes en 28 jours. Exercices variés de gainage quotidiens.',
        recommendedExercises:
          'Planche, planche latérale, mountain climbers, russian twists, dead bug',
        duration: 28,
        difficulty: 'hard',
        isPublic: true,
        type: 'fitness',
        score: 4100,
        gymId: null,
        creatorId: admin.id,
        creatorType: 'user',
      },
      {
        name: 'Cardio Blast 14 Jours',
        description: 'Boostez votre condition cardiovasculaire en seulement 2 semaines',
        objectives: 'Séances cardio progressives de 15 à 45 minutes. HIIT, course, vélo.',
        recommendedExercises: 'Course, vélo, rameur, burpees, jumping jacks, mountain climbers',
        duration: 14,
        difficulty: 'medium',
        isPublic: true,
        type: 'cardio',
        score: 2400,
        gymId: null,
        creatorId: admin.id,
        creatorType: 'user',
      },
      {
        name: 'Défi Débutant - Premiers Pas',
        description: 'Programme idéal pour commencer le fitness en douceur',
        objectives: "Habitudes saines : 20 min d'activité/jour, 8 verres d'eau, 7h de sommeil.",
        recommendedExercises: 'Marche rapide, étirements, exercices au poids du corps adaptés',
        duration: 10,
        difficulty: 'easy',
        isPublic: true,
        type: 'wellness',
        score: 1200,
        gymId: null,
        creatorId: admin.id,
        creatorType: 'user',
      },

      // Défis spécifiques aux salles
      {
        name: 'PowerGym Beast Mode',
        description: 'Défi exclusif PowerGym pour les guerriers de la musculation',
        objectives:
          'Programme force : développé couché, squat, soulevé de terre. Progression sur 6 semaines.',
        recommendedExercises:
          'Développé couché, squat, soulevé de terre, rowing, développé militaire',
        duration: 42,
        difficulty: 'hard',
        isPublic: true,
        type: 'strength',
        score: 5200,
        gymId: powerGym.id,
        creatorId: sophie.id,
        creatorType: 'gym',
      },
      {
        name: 'FitClub Transformation',
        description: 'Programme complet de transformation physique chez FitClub',
        objectives: '8 semaines : musculation 3x/semaine + cardio 2x/semaine + nutrition guidée.',
        recommendedExercises: 'Circuit training, musculation guidée, cardio varié, stretching',
        duration: 56,
        difficulty: 'medium',
        isPublic: true,
        type: 'fitness',
        score: 6800,
        gymId: fitClub.id,
        creatorId: julien.id,
        creatorType: 'gym',
      },
      {
        name: 'ZenFit Équilibre Corps-Esprit',
        description: 'Harmonisez votre corps et votre mental avec ZenFit',
        objectives: 'Yoga quotidien 30 min + méditation 10 min + activité physique douce.',
        recommendedExercises: 'Yoga, pilates, méditation, marche consciente, étirements',
        duration: 21,
        difficulty: 'easy',
        isPublic: true,
        type: 'wellness',
        score: 3100,
        gymId: zenFit.id,
        creatorId: camille.id,
        creatorType: 'gym',
      },

      // Défis créés par les utilisateurs
      {
        name: 'Défi Entre Amis - Summer Body',
        description: "Défi personnel pour préparer l'été entre amis",
        objectives:
          'Programme personnalisé : 5 séances/semaine, alimentation équilibrée, suivi photo.',
        recommendedExercises: 'Musculation, cardio, cours collectifs, natation',
        duration: 35,
        difficulty: 'medium',
        isPublic: false,
        type: 'fitness',
        score: 4200,
        gymId: null,
        creatorId: (await User.findByOrFail('email', 'thomas.petit@email.fr')).id,
        creatorType: 'user',
      },
      {
        name: 'Marathon Training',
        description: 'Préparation intensive pour le marathon de Paris',
        objectives: "Plan d'entraînement 16 semaines : endurance, vitesse, récupération.",
        recommendedExercises: 'Course longue, fractionné, tempo run, récupération active',
        duration: 112,
        difficulty: 'hard',
        isPublic: true,
        type: 'endurance',
        score: 8900,
        gymId: null,
        creatorId: (await User.findByOrFail('email', 'marie.lefevre@email.fr')).id,
        creatorType: 'user',
      },
      {
        name: 'Défi Étudiant - Stress Out',
        description: 'Évacuer le stress des examens par le sport',
        objectives: 'Sessions courtes mais efficaces : 30 min max, 4x/semaine minimum.',
        recommendedExercises: 'HIIT, boxe, course, yoga, étirements',
        duration: 21,
        difficulty: 'medium',
        isPublic: true,
        type: 'wellness',
        score: 2800,
        gymId: null,
        creatorId: (await User.findByOrFail('email', 'antoine.garnier@email.fr')).id,
        creatorType: 'user',
      },

      // Défis saisonniers
      {
        name: 'Défi Nouvel An - Nouvelle Moi',
        description: 'Résolution 2024 : transformer sa vie par le sport',
        objectives: 'Habitudes durables : sport 5x/semaine, alimentation saine, sommeil qualité.',
        recommendedExercises: 'Programme varié, découverte nouvelles activités, suivi progrès',
        duration: 90,
        difficulty: 'medium',
        isPublic: true,
        type: 'lifestyle',
        score: 7500,
        gymId: null,
        creatorId: admin.id,
        creatorType: 'user',
      },
      {
        name: 'Beach Body Spring',
        description: 'Préparez votre corps pour la saison estivale',
        objectives: 'Tonification, perte de graisse, gain de confiance en 10 semaines.',
        recommendedExercises: 'Circuit training, cardio HIIT, musculation sculptante, nutrition',
        duration: 70,
        difficulty: 'medium',
        isPublic: true,
        type: 'fitness',
        score: 6200,
        gymId: null,
        creatorId: admin.id,
        creatorType: 'user',
      },

      // Défis techniques spécialisés
      {
        name: 'Maîtrise des Tractions',
        description: 'De 0 à 20 tractions consécutives',
        objectives: 'Progression technique : tractions assistées vers tractions complètes.',
        recommendedExercises: 'Tractions assistées, rowing, lat pulldown, renforcement dorsaux',
        duration: 49,
        difficulty: 'hard',
        isPublic: true,
        type: 'strength',
        score: 4800,
        gymId: powerGym.id,
        creatorId: sophie.id,
        creatorType: 'gym',
      },
      {
        name: 'Souplesse Intégrale',
        description: 'Améliorez votre flexibilité et mobilité articulaire',
        objectives: 'Séances étirements quotidiennes, tests flexibilité, progression mesurée.',
        recommendedExercises: 'Étirements statiques, yoga, mobilité articulaire, foam rolling',
        duration: 42,
        difficulty: 'easy',
        isPublic: true,
        type: 'mobility',
        score: 3400,
        gymId: zenFit.id,
        creatorId: camille.id,
        creatorType: 'gym',
      },
    ])

    console.log('✅ Défis créés avec succès')
  }
}
