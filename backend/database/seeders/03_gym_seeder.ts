import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gym from '#models/gym'
import User from '#models/user'

export default class GymSeeder extends BaseSeeder {
  async run() {
    // Récupération des propriétaires de salle
    const sophieDubois = await User.findByOrFail('email', 'sophie.dubois@powergym.fr')
    const julienMoreau = await User.findByOrFail('email', 'julien.moreau@fitclub.fr')
    const camilleRousseau = await User.findByOrFail('email', 'camille.rousseau@zenfit.fr')

    await Gym.createMany([
      {
        name: 'PowerGym Paris',
        contact: '01 42 85 73 94',
        description: 'Salle de sport haut de gamme au cœur de Paris.',
        address: '15 Rue de Rivoli, 75001 Paris',
        detailedDescription:
          'PowerGym Paris offre un équipement de pointe et des coachs certifiés dans un environnement moderne et motivant. Spécialisée dans la musculation et le fitness haute performance.',
        facilities: [
          'Espace cardio premium',
          'Zone musculation',
          'Studio cours collectifs',
          'Vestiaires avec casiers',
          'Sauna finlandais',
          'Espace détente',
        ],
        equipment: [
          'Tapis de course professionnels',
          "Haltères jusqu'à 50kg",
          'Bancs de musculation',
          'Machines à câbles',
          'Vélos elliptiques',
          'Rameurs Concept2',
        ],
        activityTypes: [
          'Musculation',
          'Cardio training',
          'Cours collectifs',
          'Coaching personnel',
          'Préparation physique',
        ],
        totalScore: 4750,
        ownerId: sophieDubois.id,
        status: 'approved',
      },
      {
        name: 'FitClub Lyon',
        contact: '04 78 92 15 67',
        description: 'Club de fitness convivial dans le centre de Lyon.',
        address: '42 Cours Lafayette, 69003 Lyon',
        detailedDescription:
          'FitClub Lyon propose une approche équilibrée du fitness avec des programmes adaptés à tous les niveaux. Ambiance chaleureuse et équipe professionnelle à votre service.',
        facilities: [
          'Grande salle de fitness',
          'Espace poids libres',
          'Studios thématiques',
          'Vestiaires spacieux',
          'Bar protéiné',
        ],
        equipment: [
          'Appareils cardio variés',
          'Poids libres complets',
          'Machines guidées',
          'Matériel fonctionnel',
          'Équipement pilates',
        ],
        activityTypes: [
          'Fitness général',
          'Musculation douce',
          'Cours en groupe',
          'Aqua fitness',
          'Stretching',
        ],
        totalScore: 3920,
        ownerId: julienMoreau.id,
        status: 'approved',
      },
      {
        name: 'ZenFit Marseille',
        contact: '04 91 54 82 36',
        description: 'Centre de bien-être et fitness holistique.',
        address: '88 Avenue du Prado, 13008 Marseille',
        detailedDescription:
          'ZenFit Marseille allie performance sportive et bien-être mental. Découvrez notre approche unique combinant fitness traditionnel et disciplines douces dans un cadre zen et apaisant.',
        facilities: [
          'Dojo zen',
          'Salle de musculation',
          'Studio yoga',
          'Vestiaires éco-responsables',
          'Terrasse détente',
          'Espace méditation',
        ],
        equipment: [
          'Équipements éco-conçus',
          'Haltères en bambou',
          'Tapis de yoga premium',
          'Appareils à résistance',
          'Accessoires pilates',
          'Matériel de méditation',
        ],
        activityTypes: [
          'Yoga dynamique',
          'Pilates',
          'Musculation fonctionnelle',
          'Méditation',
          'Fitness doux',
          'Préparation mentale',
        ],
        totalScore: 4180,
        ownerId: camilleRousseau.id,
        status: 'approved',
      },
      {
        name: 'Gym Express Toulouse',
        contact: '05 61 47 29 83',
        description: 'Salle de sport 24h/24 pour les actifs pressés.',
        address: '23 Allées Jean Jaurès, 31000 Toulouse',
        detailedDescription:
          "Gym Express Toulouse s'adapte à votre emploi du temps chargé avec un accès 24h/24 et des entraînements express mais efficaces. Parfait pour les professionnels et étudiants.",
        facilities: [
          'Accès 24h/24',
          'Espace compact optimisé',
          'Vestiaires automatisés',
          'Zone récupération',
        ],
        equipment: [
          'Stations multi-fonctions',
          'Équipements connectés',
          'Matériel HIIT',
          'Appareils à charge guidée',
        ],
        activityTypes: ['Entraînement express', 'HIIT', 'Circuit training', 'Musculation rapide'],
        totalScore: 2890,
        ownerId: sophieDubois.id,
        status: 'pending',
      },
      {
        name: 'AquaFit Nice',
        contact: '04 93 87 45 62',
        description: 'Centre aquatique et fitness en bord de mer.',
        address: '156 Promenade des Anglais, 06000 Nice',
        detailedDescription:
          'AquaFit Nice profite de sa situation exceptionnelle face à la Méditerranée pour offrir des programmes fitness uniques combinant activités aquatiques et terrestres.',
        facilities: [
          'Piscine 25m',
          "Bassin d'aqua-fitness",
          'Terrasse fitness',
          'Solarium',
          'Vestiaires avec vue mer',
        ],
        equipment: [
          'Vélos aquatiques',
          'Tapis aquatiques',
          'Équipement outdoor',
          'Matériel aqua-training',
        ],
        activityTypes: [
          'Aqua-fitness',
          'Natation',
          'Fitness outdoor',
          'Aqua-jogging',
          'Beach training',
        ],
        totalScore: 3650,
        ownerId: julienMoreau.id,
        status: 'approved',
      },
    ])

    console.log('✅ Salles de sport créées avec succès')
  }
}
