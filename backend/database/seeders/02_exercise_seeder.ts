import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Exercise from '#models/exercise'

export default class ExerciseSeeder extends BaseSeeder {
  async run() {
    await Exercise.createMany([
      // Exercices de musculation haut du corps
      {
        name: 'Pompes',
        description:
          'Exercice de base pour développer la force du haut du corps. Travaille principalement les pectoraux, triceps et deltoïdes antérieurs.',
        muscles: ['pectoraux', 'triceps', 'deltoïdes'],
      },
      {
        name: 'Développé couché haltères',
        description:
          'Exercice fondamental pour le développement des pectoraux. Permet un mouvement plus naturel que la barre.',
        muscles: ['pectoraux', 'triceps', 'deltoïdes antérieurs'],
      },
      {
        name: 'Tractions',
        description:
          'Exercice excellent pour le développement du dos et des biceps. Variante pronation ou supination.',
        muscles: ['dorsaux', 'biceps', 'rhomboïdes', 'trapèzes'],
      },
      {
        name: 'Rowing haltère',
        description:
          'Exercice pour épaissir le dos et améliorer la posture. Se réalise penché en avant.',
        muscles: ['dorsaux', 'rhomboïdes', 'trapèzes moyens', 'biceps'],
      },
      {
        name: 'Développé militaire',
        description:
          'Exercice roi pour les épaules. Développe la force fonctionnelle du haut du corps.',
        muscles: ['deltoïdes', 'triceps', 'trapèzes supérieurs'],
      },
      {
        name: 'Élévations latérales',
        description: 'Isolation des deltoïdes moyens pour créer la largeur des épaules.',
        muscles: ['deltoïdes moyens'],
      },
      {
        name: 'Curl biceps',
        description:
          "Exercice d'isolation pour le développement des biceps. Nombreuses variantes possibles.",
        muscles: ['biceps', 'brachiaux'],
      },
      {
        name: 'Dips',
        description:
          'Exercice au poids du corps excellent pour les triceps et la partie basse des pectoraux.',
        muscles: ['triceps', 'pectoraux inférieurs', 'deltoïdes antérieurs'],
      },

      // Exercices de musculation bas du corps
      {
        name: 'Squats',
        description:
          'Exercice fondamental pour les jambes et les fessiers. Base de tous les mouvements de musculation.',
        muscles: ['quadriceps', 'fessiers', 'ischio-jambiers', 'mollets'],
      },
      {
        name: 'Fentes',
        description:
          "Exercice unilatéral excellent pour l'équilibre et le développement harmonieux des jambes.",
        muscles: ['quadriceps', 'fessiers', 'ischio-jambiers'],
      },
      {
        name: 'Soulevé de terre',
        description:
          'Mouvement complet qui sollicite toute la chaîne postérieure. Exercice roi de la force.',
        muscles: ['ischio-jambiers', 'fessiers', 'dorsaux', 'trapèzes', 'avant-bras'],
      },
      {
        name: 'Hip thrust',
        description: 'Exercice spécifique pour le développement maximal des fessiers.',
        muscles: ['fessiers', 'ischio-jambiers'],
      },
      {
        name: 'Leg curl',
        description: 'Isolation des ischio-jambiers. Complément essentiel aux squats.',
        muscles: ['ischio-jambiers'],
      },
      {
        name: 'Mollets debout',
        description: 'Exercice pour développer le volume et la force des mollets.',
        muscles: ['mollets', 'soléaires'],
      },

      // Exercices de gainage et abdominaux
      {
        name: 'Planche',
        description:
          'Exercice isométrique fondamental pour renforcer le core et améliorer la stabilité.',
        muscles: ['abdominaux', 'lombaires', 'fessiers', 'épaules'],
      },
      {
        name: 'Crunchs',
        description: "Exercice d'isolation pour les abdominaux grands droits.",
        muscles: ['abdominaux'],
      },
      {
        name: 'Russian twists',
        description: 'Exercice pour travailler les obliques et la rotation du tronc.',
        muscles: ['obliques', 'abdominaux'],
      },
      {
        name: 'Mountain climbers',
        description: 'Exercice dynamique combinant gainage et cardio.',
        muscles: ['abdominaux', 'épaules', 'jambes'],
      },

      // Exercices cardio
      {
        name: 'Burpees',
        description:
          'Exercice complet combinant force et cardio. Très efficace pour la condition physique.',
        muscles: ['corps entier'],
      },
      {
        name: 'Jumping jacks',
        description: "Exercice cardiovasculaire simple et efficace pour l'échauffement.",
        muscles: ['mollets', 'épaules', 'abdominaux'],
      },
      {
        name: 'Course sur place',
        description: "Exercice cardio de base, idéal pour l'échauffement ou les intervalles.",
        muscles: ['jambes', 'système cardiovasculaire'],
      },

      // Exercices fonctionnels
      {
        name: 'Kettlebell swing',
        description: 'Exercice explosif excellent pour la puissance de la chaîne postérieure.',
        muscles: ['fessiers', 'ischio-jambiers', 'dorsaux', 'épaules'],
      },
      {
        name: 'Turkish get-up',
        description: 'Mouvement complexe développant stabilité, mobilité et force.',
        muscles: ['corps entier', 'stabilisateurs'],
      },
      {
        name: "Farmer's walk",
        description: "Exercice de portage développant la force fonctionnelle et l'endurance.",
        muscles: ['avant-bras', 'trapèzes', 'abdominaux', 'jambes'],
      },
    ])

    console.log('✅ Exercices créés avec succès')
  }
}
