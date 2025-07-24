import type { HttpContext } from '@adonisjs/core/http'
import { ChallengeService } from '../services/challenge_service.js'
import { BaseController } from './base_controller.js'
import { ChallengeData, ChallengeFilterOptions } from '../types/challenge.dto.js'

interface ExploreFilters extends ChallengeFilterOptions {
  search?: string
}

interface ChallengeWithSource extends ChallengeData {
  source: 'user' | 'gym'
}

export default class ChallengeExploreController extends BaseController {
  private challengeService: ChallengeService

  constructor() {
    super()
    this.challengeService = new ChallengeService()
  }

  /**
   * Explore all public user challenges with advanced filtering
   */
  async exploreUserChallenges({ request, response }: HttpContext) {
    try {
      const {
        difficulty,
        type,
        minDuration,
        maxDuration,
        search,
        page = 1,
        limit = 20,
      } = request.qs()

      const filters: ExploreFilters = {
        difficulty: difficulty as 'easy' | 'medium' | 'hard' | undefined,
        type,
        minDuration: minDuration ? parseInt(minDuration) : undefined,
        maxDuration: maxDuration ? parseInt(maxDuration) : undefined,
        search,
        isPublic: true, // Force public challenges only
      }

      // Remove undefined values
      Object.keys(filters).forEach((key) => {
        const filterKey = key as keyof ExploreFilters
        if (filters[filterKey] === undefined) {
          delete filters[filterKey]
        }
      })

      const result = await this.challengeService.getUserChallenges(filters)

      // Basic pagination logic (can be improved)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = result.data?.slice(startIndex, endIndex) || []

      return response.ok({
        data: paginatedData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.data?.length || 0,
          totalPages: Math.ceil((result.data?.length || 0) / limit),
        },
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Explore gym challenges by gym or all gyms
   */
  async exploreGymChallenges({ request, response }: HttpContext) {
    try {
      const { gymId, search, page = 1, limit = 20 } = request.qs()

      const result = await this.challengeService.getGymChallenges(
        gymId ? parseInt(gymId) : undefined
      )

      let filteredData = result.data || []

      // Apply search filter if provided
      if (search) {
        filteredData = filteredData.filter(
          (challenge: ChallengeData) =>
            challenge.name.toLowerCase().includes(search.toLowerCase()) ||
            challenge.description?.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Basic pagination logic
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filteredData.slice(startIndex, endIndex)

      return response.ok({
        data: paginatedData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredData.length,
          totalPages: Math.ceil(filteredData.length / limit),
        },
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Get challenge details for exploration
   */
  async show({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const result = await this.challengeService.getChallengeById(id)

      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Get popular/trending challenges
   */
  async trending({ response }: HttpContext) {
    try {
      // Get all public user challenges (simplified trending logic)
      const result = await this.challengeService.getUserChallenges({ isPublic: true })

      // Simple trending logic - can be improved with participation metrics
      const trending = result.data?.slice(0, 10) || []

      return response.ok({
        data: trending,
        message: 'Trending challenges based on recent activity',
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Get recommended challenges based on user profile
   */
  async recommended({ auth, response }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)

      // Simple recommendation logic - can be improved with user preferences
      const result = await this.challengeService.getUserChallenges({
        isPublic: true,
        difficulty: 'easy', // Start with easy challenges
      })

      const recommended = result.data?.slice(0, 10) || []

      return response.ok({
        data: recommended,
        message: `Personalized recommendations for ${user.fullName}`,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Search challenges across all types
   */
  async search({ request, response }: HttpContext) {
    try {
      const { query, type = 'all', page = 1, limit = 20 } = request.qs()

      if (!query || query.trim().length < 2) {
        return response.badRequest({
          message: 'Search query must be at least 2 characters long',
        })
      }

      let results = []

      if (type === 'all' || type === 'user') {
        const userChallenges = await this.challengeService.getUserChallenges({
          isPublic: true,
        })
        // Filter by search query manually since service doesn't support search in filters
        const filteredUser = (userChallenges.data || []).filter(
          (challenge: ChallengeData) =>
            challenge.name.toLowerCase().includes(query.toLowerCase()) ||
            challenge.description?.toLowerCase().includes(query.toLowerCase())
        )
        results.push(
          ...filteredUser.map((c: ChallengeData): ChallengeWithSource => ({ ...c, source: 'user' }))
        )
      }

      if (type === 'all' || type === 'gym') {
        const gymChallenges = await this.challengeService.getGymChallenges()
        const filteredGym = (gymChallenges.data || []).filter(
          (challenge: ChallengeData) =>
            challenge.name.toLowerCase().includes(query.toLowerCase()) ||
            challenge.description?.toLowerCase().includes(query.toLowerCase())
        )
        results.push(
          ...filteredGym.map((c: ChallengeData): ChallengeWithSource => ({ ...c, source: 'gym' }))
        )
      }

      // Sort by relevance (simple name match priority)
      results.sort((a, b) => {
        const aScore = a.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
        const bScore = b.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
        return bScore - aScore
      })

      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedResults = results.slice(startIndex, endIndex)

      return response.ok({
        data: paginatedResults,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: results.length,
          totalPages: Math.ceil(results.length / limit),
        },
        query: query,
        type: type,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
