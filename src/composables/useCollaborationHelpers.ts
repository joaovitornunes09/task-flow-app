import { CollaborationRole } from '@/enums'

export const useCollaborationHelpers = () => {
  const getRoleLabel = (role: string): string => {
    switch (role) {
      case CollaborationRole.OWNER: return 'Proprietário'
      case CollaborationRole.COLLABORATOR: return 'Colaborador'
      case CollaborationRole.VIEWER: return 'Visualizador'
      default: return role
    }
  }

  const getRoleBadgeClass = (role: string): string => {
    switch (role) {
      case CollaborationRole.OWNER: return 'bg-purple-100 text-purple-700'
      case CollaborationRole.COLLABORATOR: return 'bg-blue-100 text-blue-700'
      case CollaborationRole.VIEWER: return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return {
    getRoleLabel,
    getRoleBadgeClass
  }
}