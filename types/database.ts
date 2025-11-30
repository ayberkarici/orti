export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            calendars: {
                Row: {
                    id: string
                    name: string
                    invite_code: string
                    created_at: string
                    owner_id: string
                }
                Insert: {
                    id?: string
                    name: string
                    invite_code: string
                    created_at?: string
                    owner_id: string
                }
                Update: {
                    id?: string
                    name?: string
                    invite_code?: string
                    created_at?: string
                    owner_id?: string
                }
            }
            calendar_members: {
                Row: {
                    calendar_id: string
                    user_id: string
                    role: 'admin' | 'member'
                    joined_at: string
                }
                Insert: {
                    calendar_id: string
                    user_id: string
                    role?: 'admin' | 'member'
                    joined_at?: string
                }
                Update: {
                    calendar_id?: string
                    user_id?: string
                    role?: 'admin' | 'member'
                    joined_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    calendar_id: string
                    title: string
                    start_time: string
                    end_time: string
                    assigned_to: string[]
                    created_by: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    calendar_id: string
                    title: string
                    start_time: string
                    end_time: string
                    assigned_to?: string[]
                    created_by: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    calendar_id?: string
                    title?: string
                    start_time?: string
                    end_time?: string
                    assigned_to?: string[]
                    created_by?: string
                    created_at?: string
                }
            }
            daily_notes: {
                Row: {
                    id: string
                    calendar_id: string
                    date: string
                    content: string
                    updated_by: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    calendar_id: string
                    date: string
                    content: string
                    updated_by: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    calendar_id?: string
                    date?: string
                    content?: string
                    updated_by?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
