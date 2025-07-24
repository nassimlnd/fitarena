export interface CreateGymDTO {
  name: string
  contact: string
  description?: string
  address?: string
  detailedDescription?: string
  facilities?: string[]
  equipment?: string[]
  activityTypes?: string[]
}

export interface UpdateGymDTO {
  name?: string
  contact?: string
  description?: string
  address?: string
  detailedDescription?: string
  facilities?: string[]
  equipment?: string[]
  activityTypes?: string[]
}

export interface GymData {
  id: number
  name: string
  contact: string
  description: string
  address: string | null
  detailedDescription: string | null
  facilities: string[]
  equipment: string[]
  activityTypes: string[]
  totalScore: number
  ownerId: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface GymFilterOptions {
  status?: 'pending' | 'approved' | 'rejected'
  ownerId?: number
}
