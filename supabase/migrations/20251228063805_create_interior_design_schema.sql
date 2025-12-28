/*
  # Vinayak Interior's & Carpentry Website Database Schema

  ## Overview
  Complete database schema for a Vinayak Interior's & Carpentry business website
  with public-facing features and admin dashboard.

  ## New Tables
  
  ### 1. services
  Stores all available services offered by the company
  - `id` (uuid, primary key)
  - `title` (text) - Service name
  - `description` (text) - Detailed description
  - `process_steps` (jsonb) - Array of process steps
  - `starting_price` (text, optional) - Starting price display
  - `image_url` (text) - Service image
  - `category` (text) - Service category
  - `is_enabled` (boolean) - Active/inactive status
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. projects
  Portfolio of completed works
  - `id` (uuid, primary key)
  - `title` (text) - Project name
  - `description` (text) - Project details
  - `category` (text) - Residential, Commercial, etc.
  - `images` (jsonb) - Array of image URLs
  - `before_images` (jsonb, optional) - Before photos
  - `after_images` (jsonb, optional) - After photos
  - `materials_used` (text, optional)
  - `completion_time` (text) - e.g., "3 weeks"
  - `is_published` (boolean) - Visibility status
  - `featured` (boolean) - Show on homepage
  - `display_order` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. inquiries
  Customer inquiries and quote requests
  - `id` (uuid, primary key)
  - `customer_name` (text)
  - `email` (text)
  - `phone` (text)
  - `service_type` (text)
  - `budget_range` (text, optional)
  - `location` (text)
  - `preferred_contact` (text) - Email, Phone, WhatsApp
  - `message` (text)
  - `reference_images` (jsonb, optional) - Array of uploaded image URLs
  - `status` (text) - New, In Progress, Completed
  - `admin_notes` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. interest_registrations
  Future client registrations for marketing
  - `id` (uuid, primary key)
  - `name` (text)
  - `email` (text)
  - `phone` (text)
  - `interested_service` (text)
  - `preferred_timeline` (text)
  - `created_at` (timestamptz)

  ### 5. reviews
  Customer testimonials and reviews
  - `id` (uuid, primary key)
  - `customer_name` (text)
  - `rating` (integer) - 1-5 stars
  - `review_text` (text)
  - `project_image` (text, optional)
  - `project_title` (text, optional)
  - `is_approved` (boolean) - Admin approval status
  - `is_featured` (boolean) - Show on homepage
  - `created_at` (timestamptz)

  ### 6. website_settings
  Dynamic website content and configuration
  - `id` (uuid, primary key)
  - `key` (text, unique) - Setting identifier
  - `value` (jsonb) - Setting value (flexible structure)
  - `updated_at` (timestamptz)

  ### 7. admin_roles
  Admin user role management
  - `user_id` (uuid, primary key) - References auth.users
  - `role` (text) - Admin or Staff
  - `created_at` (timestamptz)

  ## Security
  
  - Enable RLS on all tables
  - Public read access for published content (projects, services, reviews)
  - Authenticated admin access for all management operations
  - Strict ownership and role-based policies
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE inquiry_status AS ENUM ('New', 'In Progress', 'Completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE admin_role_type AS ENUM ('Admin', 'Staff');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  process_steps jsonb DEFAULT '[]'::jsonb,
  starting_price text,
  image_url text,
  category text NOT NULL,
  is_enabled boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  before_images jsonb DEFAULT '[]'::jsonb,
  after_images jsonb DEFAULT '[]'::jsonb,
  materials_used text,
  completion_time text,
  is_published boolean DEFAULT false,
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_type text NOT NULL,
  budget_range text,
  location text NOT NULL,
  preferred_contact text DEFAULT 'Email',
  message text,
  reference_images jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'New',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interest Registrations Table
CREATE TABLE IF NOT EXISTS interest_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  interested_service text NOT NULL,
  preferred_timeline text,
  created_at timestamptz DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  project_image text,
  project_title text,
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Website Settings Table
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Admin Roles Table
CREATE TABLE IF NOT EXISTS admin_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'Staff',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Services
-- Public: Read enabled services
CREATE POLICY "Anyone can view enabled services"
  ON services FOR SELECT
  USING (is_enabled = true);

-- Admin: Full access to services
CREATE POLICY "Authenticated admins can view all services"
  ON services FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- RLS Policies for Projects
-- Public: Read published projects
CREATE POLICY "Anyone can view published projects"
  ON projects FOR SELECT
  USING (is_published = true);

-- Admin: Full access to projects
CREATE POLICY "Authenticated admins can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- RLS Policies for Inquiries
-- Public: Insert only (customers can submit)
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- Admin: Read and update
CREATE POLICY "Authenticated admins can view inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can update inquiries"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can delete inquiries"
  ON inquiries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- RLS Policies for Interest Registrations
-- Public: Insert only
CREATE POLICY "Anyone can submit interest registrations"
  ON interest_registrations FOR INSERT
  WITH CHECK (true);

-- Admin: Read only
CREATE POLICY "Authenticated admins can view interest registrations"
  ON interest_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can delete interest registrations"
  ON interest_registrations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- RLS Policies for Reviews
-- Public: Read approved reviews only
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

-- Public: Insert reviews (pending approval)
CREATE POLICY "Anyone can submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Admin: Full access
CREATE POLICY "Authenticated admins can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- RLS Policies for Website Settings
-- Public: Read all settings
CREATE POLICY "Anyone can view website settings"
  ON website_settings FOR SELECT
  USING (true);

-- Admin: Full access
CREATE POLICY "Authenticated admins can insert website settings"
  ON website_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can update website settings"
  ON website_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- RLS Policies for Admin Roles
-- Only admins can manage roles
CREATE POLICY "Authenticated admins can view admin roles"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can insert admin roles"
  ON admin_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'Admin'
    )
  );

CREATE POLICY "Authenticated admins can update admin roles"
  ON admin_roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'Admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_enabled ON services(is_enabled);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);

-- Insert default website settings
INSERT INTO website_settings (key, value) VALUES
  ('hero_title', '"Vinayak Interior''s & Custom Carpentry Solutions"'::jsonb),
  ('hero_subtitle', '"Transform your space with expert craftsmanship and timeless design"'::jsonb),
  ('company_phone', '"+1234567890"'::jsonb),
  ('company_email', '"info@interiordesign.com"'::jsonb),
  ('company_address', '"123 Design Street, City, State 12345"'::jsonb),
  ('company_whatsapp', '"+1234567890"'::jsonb),
  ('business_hours', '"Monday - Saturday: 9:00 AM - 6:00 PM"'::jsonb),
  ('years_experience', '15'::jsonb),
  ('completed_projects', '250'::jsonb),
  ('happy_clients', '180'::jsonb),
  ('google_maps_url', '""'::jsonb),
  ('facebook_url', '""'::jsonb),
  ('instagram_url', '""'::jsonb),
  ('linkedin_url', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;