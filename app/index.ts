export type ResourceType =
  | 'link' | 'tool' | 'pdf' | 'roadmap'
  | 'internship' | 'course' | 'image' | 'note' | 'repo' | 'other'

export type Priority = 'normal' | 'high' | 'pinned'
export type TodoPriority = 'h' | 'm' | 'l'

export interface Resource {
  id?: string
  user_id?: string
  type: ResourceType
  title: string
  url?: string
  description?: string
  category?: string
  tags?: string[]
  priority?: Priority
  created_at?: string
}

export interface Todo {
  id?: string
  user_id?: string
  text: string
  done?: boolean
  priority?: TodoPriority
  created_at?: string
}

export interface ImportJSON {
  resources: Omit<Resource, 'id' | 'user_id' | 'created_at'>[]
}
