import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Challenge from '#models/challenge'
import ChallengeParticipation from '#models/challenge_participation'
import { DateTime } from 'luxon'

export default class ChallengeParticipationSeeder extends BaseSeeder {
  async run() {
    // Récupération des utilisateurs
    const thomas = await User.findByOrFail('email', 'thomas.petit@email.fr')
    const marie = await User.findByOrFail('email', 'marie.lefevre@email.fr')
    const antoine = await User.findByOrFail('email', 'antoine.garnier@email.fr')
    const lea = await User.findByOrFail('email', 'lea.bernard@email.fr')
    const nicolas = await User.findByOrFail('email', 'nicolas.laurent@email.fr')
    const emma = await User.findByOrFail('email', 'emma.durand@email.fr')
    const lucas = await User.findByOrFail('email', 'lucas.simon@email.fr')
    const chloe = await User.findByOrFail('email', 'chloe.michel@email.fr')

    // Récupération des défis
    const pompesChallenge = await Challenge.findByOrFail('name', '30 Jours de Pompes')
    const squatChallenge = await Challenge.findByOrFail('name', 'Squat Challenge 21 Jours')
    const cardioChallenge = await Challenge.findByOrFail('name', 'Cardio Blast 14 Jours')
    const coreChallenge = await Challenge.findByOrFail('name', 'Iron Core - Gainage Extrême')
    const debutantChallenge = await Challenge.findByOrFail('name', 'Défi Débutant - Premiers Pas')
    const powerGymChallenge = await Challenge.findByOrFail('name', 'PowerGym Beast Mode')
    const fitClubChallenge = await Challenge.findByOrFail('name', 'FitClub Transformation')
    const zenFitChallenge = await Challenge.findByOrFail('name', 'ZenFit Équilibre Corps-Esprit')

    // Création des participations avec statuts variés
    const participations = [
      // Thomas - utilisateur actif avec plusieurs défis
      {
        userId: thomas.id,
        challengeId: pompesChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 12 }),
        notes: 'Très motivé par ce défi ! Progression constante chaque jour.',
        completedAt: null,
      },
      {
        userId: thomas.id,
        challengeId: squatChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 30 }),
        completedAt: DateTime.now().minus({ days: 9 }),
        notes: 'Défi terminé avec succès ! Jambes beaucoup plus fortes maintenant.',
      },
      {
        userId: thomas.id,
        challengeId: debutantChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 60 }),
        completedAt: DateTime.now().minus({ days: 50 }),
        notes: 'Parfait pour commencer, très bien conçu pour les débutants.',
      },

      // Marie - marathonienne expérimentée
      {
        userId: marie.id,
        challengeId: cardioChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 20 }),
        completedAt: DateTime.now().minus({ days: 6 }),
        notes: 'Excellent complément à mon entraînement marathon. Sessions très bien structurées.',
      },
      {
        userId: marie.id,
        challengeId: coreChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 8 }),
        notes: 'Le gainage me manquait, ce défi tombe à pic pour renforcer mon core.',
        completedAt: null,
      },
      {
        userId: marie.id,
        challengeId: fitClubChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 15 }),
        notes: 'Programme de transformation très complet, je recommande !',
        completedAt: null,
      },

      // Antoine - étudiant avec peu de temps
      {
        userId: antoine.id,
        challengeId: coreChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 5 }),
        notes: 'Parfait pour mes révisions, sessions courtes mais efficaces.',
        completedAt: null,
      },
      {
        userId: antoine.id,
        challengeId: debutantChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 25 }),
        completedAt: DateTime.now().minus({ days: 15 }),
        notes: 'Idéal pour reprendre le sport après une pause. Très accessible.',
      },

      // Léa - focus sur le bas du corps
      {
        userId: lea.id,
        challengeId: squatChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 8 }),
        notes: 'Exactement ce que je cherchais pour muscler mes fessiers !',
        completedAt: null,
      },
      {
        userId: lea.id,
        challengeId: cardioChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 35 }),
        completedAt: DateTime.now().minus({ days: 21 }),
        notes: 'Super pour améliorer mon cardio. Les HIIT étaient intenses mais payants.',
      },
      {
        userId: lea.id,
        challengeId: zenFitChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 3 }),
        notes: "J'adore l'approche holistique, ça fait du bien au mental aussi.",
        completedAt: null,
      },

      // Nicolas - régulier et déterminé
      {
        userId: nicolas.id,
        challengeId: pompesChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 18 }),
        notes: 'Défi plus dur que prévu mais je tiens bon ! Progression lente mais sûre.',
        completedAt: null,
      },
      {
        userId: nicolas.id,
        challengeId: coreChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 45 }),
        completedAt: DateTime.now().minus({ days: 17 }),
        notes: 'Fini ! Mon gainage a complètement changé, je me sens plus stable partout.',
      },

      // Emma - très active et motivée
      {
        userId: emma.id,
        challengeId: pompesChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 40 }),
        completedAt: DateTime.now().minus({ days: 10 }),
        notes: 'Challenge réussi ! Je suis passée de 5 à 50 pompes, incroyable !',
      },
      {
        userId: emma.id,
        challengeId: cardioChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 25 }),
        completedAt: DateTime.now().minus({ days: 11 }),
        notes: 'Parfait pour booster mon cardio. Les intervalles étaient parfaits.',
      },
      {
        userId: emma.id,
        challengeId: powerGymChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 12 }),
        notes: 'Défi sérieux ! La progression en force est remarquable chez PowerGym.',
        completedAt: null,
      },

      // Lucas - débutant motivé
      {
        userId: lucas.id,
        challengeId: debutantChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 4 }),
        notes: "Premier défi fitness ! L'approche progressive me convient parfaitement.",
        completedAt: null,
      },
      {
        userId: lucas.id,
        challengeId: zenFitChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 2 }),
        notes: "J'aime beaucoup l'aspect bien-être, moins intimidant que la musculation pure.",
        completedAt: null,
      },

      // Chloé - expérimentée et variée
      {
        userId: chloe.id,
        challengeId: squatChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 28 }),
        completedAt: DateTime.now().minus({ days: 7 }),
        notes: 'Excellent ! Mes squats sont maintenant beaucoup plus profonds et stables.',
      },
      {
        userId: chloe.id,
        challengeId: coreChallenge.id,
        status: 'completed' as const,
        startedAt: DateTime.now().minus({ days: 50 }),
        completedAt: DateTime.now().minus({ days: 22 }),
        notes: 'Défi intense mais résultats incroyables. Ma planche est passée de 30s à 4min !',
      },
      {
        userId: chloe.id,
        challengeId: fitClubChallenge.id,
        status: 'in_progress' as const,
        startedAt: DateTime.now().minus({ days: 20 }),
        notes: 'Programme de transformation très complet, je vois déjà des changements !',
        completedAt: null,
      },

      // Quelques abandons réalistes
      {
        userId: lucas.id,
        challengeId: pompesChallenge.id,
        status: 'abandoned' as const,
        startedAt: DateTime.now().minus({ days: 35 }),
        notes: "Trop difficile pour commencer, je vais d'abord finir le défi débutant.",
        completedAt: null,
      },
      {
        userId: antoine.id,
        challengeId: powerGymChallenge.id,
        status: 'abandoned' as const,
        startedAt: DateTime.now().minus({ days: 60 }),
        notes: 'Pas eu le temps avec les examens, je reprends après.',
        completedAt: null,
      },
    ]

    // Insertion en base de données
    await ChallengeParticipation.createMany(participations)

    console.log('✅ Participations aux défis créées avec succès')
  }
}
