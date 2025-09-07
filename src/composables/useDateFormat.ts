import { format, parseISO, isValid, addDays, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function useDateFormat() {
  const formatDate = (dateString: string | null, pattern: string = 'dd/MM/yyyy'): string => {
    if (!dateString) return 'Não definida'
    
    const date = parseISO(dateString)
    if (!isValid(date)) return 'Data inválida'
    
    return format(date, pattern, { locale: ptBR })
  }

  const formatDateTime = (dateString: string | null, pattern: string = 'dd/MM/yyyy HH:mm'): string => {
    if (!dateString) return 'Não definida'
    
    const date = parseISO(dateString)
    if (!isValid(date)) return 'Data inválida'
    
    return format(date, pattern, { locale: ptBR })
  }

  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return ''
    
    const date = parseISO(dateString)
    if (!isValid(date)) return ''
    
    return format(date, 'yyyy-MM-dd')
  }

  const isOverdue = (dateString: string | null): boolean => {
    if (!dateString) return false
    
    const date = parseISO(dateString)
    const today = new Date()
    
    return isValid(date) && isBefore(date, today) && format(date, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd')
  }

  const isDueSoon = (dateString: string | null, daysThreshold: number = 3): boolean => {
    if (!dateString) return false
    
    const date = parseISO(dateString)
    const today = new Date()
    const threshold = addDays(today, daysThreshold)
    
    return isValid(date) && !isBefore(date, today) && isBefore(date, threshold)
  }

  const compareDates = (a: string, b: string): number => {
    const dateA = parseISO(a)
    const dateB = parseISO(b)
    
    if (!isValid(dateA) || !isValid(dateB)) return 0
    
    return dateA.getTime() - dateB.getTime()
  }

  return {
    formatDate,
    formatDateTime,
    formatDateForInput,
    isOverdue,
    isDueSoon,
    compareDates
  }
}