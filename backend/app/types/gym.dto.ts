export interface CreateGymDTO {
  name: string
  contact: string
  description?: string
}

export interface UpdateGymDTO {
  name?: string
  contact?: string
  description?: string
}

export interface GymData {
  id: number
  name: string
  contact: string
  description: string
  ownerId: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface GymFilterOptions {
  status?: 'pending' | 'approved' | 'rejected'
  ownerId?: number
}
