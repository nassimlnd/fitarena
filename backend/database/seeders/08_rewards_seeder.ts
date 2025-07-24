import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Reward from '#models/reward'

export default class extends BaseSeeder {
  async run() {
    // Clear existing rewards safely
    await Reward.query().delete()

    // Récompenses virtuelles simples pour défis réussis (selon cahier des charges)
    await Reward.createMany([
      {
        name: 'Titre: Défieur',
        description: 'Affichez "Défieur" sur votre profil après avoir complété 3 défis',
        icon: '🏷️',
        type: 'title',
        conditions: {
          type: 'badges',
          requirements: { minBadges: 3 },
        },
        pointsCost: 0,
        isRepeatable: false,
      },
      {
        name: 'Titre: Champion',
        description: 'Titre prestigieux pour les vrais champions des défis',
        icon: '👑',
        type: 'title',
        conditions: {
          type: 'badges',
          requirements: { minBadges: 5 },
        },
        pointsCost: 0,
        isRepeatable: false,
      },
      {
        name: 'Avatar Sportif',
        description: 'Débloquez un avatar spécial pour votre profil',
        icon: '🏃‍♂️',
        type: 'virtual_item',
        conditions: {
          type: 'badges',
          requirements: { minBadges: 2 },
        },
        pointsCost: 0,
        isRepeatable: false,
      },
      {
        name: 'Médaille Virtuelle',
        description: "Médaille d'accomplissement à afficher",
        icon: '🥇',
        type: 'virtual_item',
        conditions: {
          type: 'badges',
          requirements: { minBadges: 4 },
        },
        pointsCost: 0,
        isRepeatable: false,
      },
      {
        name: 'Certificat de Mérite',
        description: 'Certificat virtuel de vos accomplissements sportifs',
        icon: '📜',
        type: 'virtual_item',
        conditions: {
          type: 'badges',
          requirements: { minBadges: 6 },
        },
        pointsCost: 0,
        isRepeatable: false,
      },
    ])

    console.log('✅ Récompenses seedées avec succès (défis réussis)')
  }
}
