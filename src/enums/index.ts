export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum CollaborationRole {
  OWNER = 'OWNER',
  COLLABORATOR = 'COLLABORATOR',
  VIEWER = 'VIEWER'
}

export const TASK_STATUS_OPTIONS = [
  {
    value: TaskStatus.TODO,
    label: 'Para Fazer',
    icon: 'Circle',
    color: 'text-gray-500'
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: 'Em Progresso',
    icon: 'Clock',
    color: 'text-blue-500'
  },
  {
    value: TaskStatus.COMPLETED,
    label: 'Concluída',
    icon: 'CheckCircle',
    color: 'text-green-500'
  }
]

export const TASK_PRIORITY_OPTIONS = [
  {
    value: TaskPriority.LOW,
    label: 'Baixa',
    color: 'text-green-500',
    bgColor: 'bg-green-500'
  },
  {
    value: TaskPriority.MEDIUM,
    label: 'Média',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500'
  },
  {
    value: TaskPriority.HIGH,
    label: 'Alta',
    color: 'text-red-500',
    bgColor: 'bg-red-500'
  }
]

export const COLLABORATION_ROLE_OPTIONS = [
  {
    value: CollaborationRole.OWNER,
    label: 'Proprietário'
  },
  {
    value: CollaborationRole.COLLABORATOR,
    label: 'Colaborador'
  },
  {
    value: CollaborationRole.VIEWER,
    label: 'Visualizador'
  }
]
