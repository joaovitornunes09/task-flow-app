import type { TaskStatus, TaskPriority, CollaborationRole } from '@/enums'

export interface TaskStatusOption {
  value: TaskStatus
  label: string
  icon: string
  color: string
}

export interface TaskPriorityOption {
  value: TaskPriority
  label: string
  color: string
  bgColor: string
}

export interface CollaborationRoleOption {
  value: CollaborationRole
  label: string
}

export type TaskStatusValue = `${TaskStatus}`
export type TaskPriorityValue = `${TaskPriority}`
export type CollaborationRoleValue = `${CollaborationRole}`