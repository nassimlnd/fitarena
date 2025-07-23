export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface FilterOptions {
  [key: string]: any
}

export interface ServiceError {
  message: string
  code?: string
  statusCode?: number
}

export class ServiceException extends Error {
  public code?: string
  public statusCode?: number

  constructor(message: string, code?: string, statusCode?: number) {
    super(message)
    this.code = code
    this.statusCode = statusCode
  }
}
