import { GymRepository } from '../repositories/gym_repository.js'
import { CreateGymDTO, UpdateGymDTO, GymData } from '../types/gym.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export class GymService {
  private gymRepository: GymRepository

  constructor() {
    this.gymRepository = new GymRepository()
  }

  async createGym(data: CreateGymDTO, ownerId: number): Promise<ServiceResponse<GymData>> {
    try {
      // Vérifier si l'utilisateur possède déjà une salle
      const existingGym = await this.gymRepository.findByOwner(ownerId)
      if (existingGym) {
        throw new ServiceException('You already own a gym', 'GYM_ALREADY_EXISTS', 409)
      }

      // Créer la salle avec le statut 'pending' par défaut
      const gym = await this.gymRepository.create({
        ...data,
        ownerId,
        status: 'pending',
      })

      return {
        success: true,
        data: this.formatGymData(gym),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }

      // Gestion des erreurs de base de données
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ServiceException(
          'A gym with this information already exists',
          'GYM_DUPLICATE',
          409
        )
      }

      throw new ServiceException('Failed to create gym', 'GYM_CREATION_FAILED', 500)
    }
  }

  async getApprovedGyms(): Promise<ServiceResponse<GymData[]>> {
    try {
      const gyms = await this.gymRepository.findApprovedGyms()
      return {
        success: true,
        data: gyms.map((gym) => this.formatGymData(gym)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch approved gyms', 'GYM_FETCH_FAILED', 500)
    }
  }

  async getGymsByStatus(
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<ServiceResponse<GymData[]>> {
    try {
      const gyms = await this.gymRepository.findByStatus(status)
      return {
        success: true,
        data: gyms.map((gym) => this.formatGymData(gym)),
      }
    } catch (error) {
      throw new ServiceException(`Failed to fetch ${status} gyms`, 'GYM_FETCH_FAILED', 500)
    }
  }

  async getPendingGyms(): Promise<ServiceResponse<GymData[]>> {
    try {
      const gyms = await this.gymRepository.findPendingGyms()
      return {
        success: true,
        data: gyms.map((gym) => this.formatGymData(gym)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch pending gyms', 'GYM_FETCH_FAILED', 500)
    }
  }

  async approveGym(gymId: number): Promise<ServiceResponse<GymData>> {
    try {
      const gym = await this.gymRepository.findById(gymId)
      if (!gym) {
        throw new ServiceException('Gym not found', 'GYM_NOT_FOUND', 404)
      }

      if (gym.status === 'approved') {
        throw new ServiceException('Gym is already approved', 'GYM_ALREADY_APPROVED', 409)
      }

      const updatedGym = await this.gymRepository.updateStatus(gymId, 'approved')
      if (!updatedGym) {
        throw new ServiceException('Failed to approve gym', 'GYM_APPROVAL_FAILED', 500)
      }

      return {
        success: true,
        data: this.formatGymData(updatedGym),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to approve gym', 'GYM_APPROVAL_FAILED', 500)
    }
  }

  async rejectGym(gymId: number): Promise<ServiceResponse<GymData>> {
    try {
      const gym = await this.gymRepository.findById(gymId)
      if (!gym) {
        throw new ServiceException('Gym not found', 'GYM_NOT_FOUND', 404)
      }

      if (gym.status === 'rejected') {
        throw new ServiceException('Gym is already rejected', 'GYM_ALREADY_REJECTED', 409)
      }

      const updatedGym = await this.gymRepository.updateStatus(gymId, 'rejected')
      if (!updatedGym) {
        throw new ServiceException('Failed to reject gym', 'GYM_REJECTION_FAILED', 500)
      }

      return {
        success: true,
        data: this.formatGymData(updatedGym),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to reject gym', 'GYM_REJECTION_FAILED', 500)
    }
  }

  async updateGym(
    gymId: number,
    data: UpdateGymDTO,
    ownerId: number
  ): Promise<ServiceResponse<GymData>> {
    try {
      const gym = await this.gymRepository.findById(gymId)
      if (!gym) {
        throw new ServiceException('Gym not found', 'GYM_NOT_FOUND', 404)
      }

      // Vérifier que l'utilisateur est bien le propriétaire
      if (gym.ownerId !== ownerId) {
        throw new ServiceException(
          'You are not authorized to update this gym',
          'GYM_UNAUTHORIZED',
          403
        )
      }

      const updatedGym = await this.gymRepository.update(gymId, data)
      if (!updatedGym) {
        throw new ServiceException('Failed to update gym', 'GYM_UPDATE_FAILED', 500)
      }

      return {
        success: true,
        data: this.formatGymData(updatedGym),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to update gym', 'GYM_UPDATE_FAILED', 500)
    }
  }

  async deleteGym(gymId: number): Promise<ServiceResponse<boolean>> {
    try {
      const deleted = await this.gymRepository.delete(gymId)
      if (!deleted) {
        throw new ServiceException('Gym not found', 'GYM_NOT_FOUND', 404)
      }

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to delete gym', 'GYM_DELETE_FAILED', 500)
    }
  }

  async getGymById(gymId: number): Promise<ServiceResponse<GymData>> {
    try {
      const gym = await this.gymRepository.findById(gymId)
      if (!gym) {
        throw new ServiceException('Gym not found', 'GYM_NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatGymData(gym),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to fetch gym', 'GYM_FETCH_FAILED', 500)
    }
  }

  async validateGymOwnership(gymId: number, ownerId: number): Promise<boolean> {
    try {
      const gym = await this.gymRepository.findById(gymId)
      return gym?.ownerId === ownerId
    } catch (error) {
      return false
    }
  }

  async incrementGymScore(gymId: number, points: number): Promise<ServiceResponse<boolean>> {
    try {
      const gym = await this.gymRepository.findById(gymId)
      if (!gym) {
        throw new ServiceException('Gym not found', 'GYM_NOT_FOUND', 404)
      }

      const newScore = (gym.totalScore || 0) + points
      await this.gymRepository.updateScore(gymId, newScore)

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to update gym score', 'GYM_SCORE_UPDATE_FAILED', 500)
    }
  }

  private formatGymData(gym: any): GymData {
    return {
      id: gym.id,
      name: gym.name,
      contact: gym.contact,
      description: gym.description,
      address: gym.address,
      detailedDescription: gym.detailedDescription,
      facilities: gym.facilities || [],
      equipment: gym.equipment || [],
      activityTypes: gym.activityTypes || [],
      totalScore: gym.totalScore || 0,
      ownerId: gym.ownerId,
      status: gym.status,
      createdAt: gym.createdAt.toISO(),
      updatedAt: gym.updatedAt.toISO(),
    }
  }
}
