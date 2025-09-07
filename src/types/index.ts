export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface Category {
  id: string
  name: string
  description: string | null
  color: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type CollaborationRole = 'OWNER' | 'COLLABORATOR' | 'VIEWER'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  categoryId: string | null
  assignedUserId: string
  createdById: string
  createdAt: string
  updatedAt: string
  category?: Category | null
  assignedUser?: User | null
  createdBy?: User | null
  collaborations?: TaskCollaboration[]
}

export interface CreateTaskData {
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string
  categoryId?: string
  assignedUserId: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  categoryId?: string
  assignedUserId?: string
}

export interface TaskCollaboration {
  id: string
  taskId: string
  userId: string
  role: CollaborationRole
  createdAt: string
  user?: User
  task?: Task
}

export interface AddCollaboratorData {
  taskId: string
  userId: string
  role: CollaborationRole
}

export interface UserReport {
  totalTasks: number
  tasksByStatus: {
    TODO: number
    IN_PROGRESS: number
    COMPLETED: number
  }
  tasksByCategory: Array<{
    categoryId: string
    categoryName: string
    count: number
  }>
  overdueTasks: number
  completedThisMonth: number
}

export interface TeamMemberReport {
  userId: string
  userName: string
  assignedTasks: number
  completedTasks: number
  overdueTasks: number
}

export interface CompletedTasksReport {
  userId: string
  startDate: string
  endDate: string
  completedTasks: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
