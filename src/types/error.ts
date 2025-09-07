export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

export function getErrorMessage(error: any, fallbackMessage: string = 'Erro desconhecido'): string {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.message) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return fallbackMessage
}

export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    error !== null &&
    typeof error === 'object' &&
    'response' in error &&
    error.response !== null &&
    typeof error.response === 'object'
  )
}
