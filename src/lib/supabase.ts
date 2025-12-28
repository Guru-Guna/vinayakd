import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          title: string
          description: string
          process_steps: any
          starting_price: string | null
          image_url: string | null
          category: string
          is_enabled: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          images: any
          before_images: any
          after_images: any
          materials_used: string | null
          completion_time: string | null
          is_published: boolean
          featured: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      inquiries: {
        Row: {
          id: string
          customer_name: string
          email: string
          phone: string
          service_type: string
          budget_range: string | null
          location: string
          preferred_contact: string
          message: string | null
          reference_images: any
          status: string
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
      }
      interest_registrations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          interested_service: string
          preferred_timeline: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['interest_registrations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['interest_registrations']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          customer_name: string
          rating: number
          review_text: string
          project_image: string | null
          project_title: string | null
          is_approved: boolean
          is_featured: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      website_settings: {
        Row: {
          id: string
          key: string
          value: any
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['website_settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['website_settings']['Insert']>
      }
      admin_roles: {
        Row: {
          user_id: string
          role: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_roles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_roles']['Insert']>
      }
    }
  }
}
