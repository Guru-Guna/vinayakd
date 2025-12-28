# Vinayak Interior's & Custom Carpentry Website

A professional, full-stack business website built for Vinayak Interior's and carpentry services companies. Features a public-facing website for showcasing services and projects, plus a secure admin dashboard for content management.

## Features

### Public Website
- **Home Page**: Hero section, services preview, featured projects, testimonials, statistics
- **Services Page**: Detailed service offerings with process steps and pricing
- **Portfolio Page**: Filterable project gallery with lightbox image viewer
- **Get a Quote**: Multi-step inquiry form with validation
- **Reviews Page**: Customer testimonials with submission form
- **Interest Registration**: Lead capture for future clients
- **Contact Page**: Contact form with company information

### Admin Dashboard
- **Analytics Overview**: Real-time statistics and recent activity
- **Project Management**: CRUD operations for portfolio projects
- **Inquiry Management**: View and manage customer quote requests
- **Review Management**: Approve/reject customer reviews
- **Service Management**: Add/edit/disable service offerings
- **Website Settings**: Update company information and content

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom design system with beige, wood, and charcoal colors)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router v6
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Database is already set up with tables and sample data

### Creating an Admin User

To access the admin dashboard, you need to create an admin user:

1. **Create a user in Supabase**:
   - Go to your Supabase Dashboard
   - Navigate to Authentication > Users
   - Click "Add User"
   - Enter email and password
   - Note the User ID after creation

2. **Grant admin access**:
   ```sql
   INSERT INTO admin_roles (user_id, role)
   VALUES ('YOUR_USER_ID_HERE', 'Admin');
   ```

3. **Login to admin panel**:
   - Navigate to `/admin/login`
   - Use the email and password you created
   - You'll be redirected to the admin dashboard

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Admin navigation
│   └── ui/              # Reusable UI components
├── layouts/             # Page layouts (Public, Admin)
├── pages/
│   ├── public/          # Public-facing pages
│   └── admin/           # Admin dashboard pages
├── lib/                 # Supabase client and utilities
└── App.tsx              # Main app with routing

supabase/
└── migrations/          # Database migrations
```

## Database Schema

- **services**: Service offerings
- **projects**: Portfolio projects
- **inquiries**: Customer quote requests
- **interest_registrations**: Lead capture
- **reviews**: Customer testimonials
- **website_settings**: Dynamic content
- **admin_roles**: Admin user permissions

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Design System

### Colors
- **Beige**: Warm, inviting tones (50-900)
- **Wood**: Natural brown tones (50-900)
- **Charcoal**: Professional grays (50-900)

### Typography
- **Display Font**: Playfair Display (headings)
- **Sans Font**: Inter (body text)

### Key Features
- Mobile-first responsive design
- Elegant hover animations
- Professional shadows and spacing
- Accessible color contrasts

## Security

- Row Level Security (RLS) on all tables
- Admin authentication required for dashboard
- Input validation on all forms
- Secure API key handling

## Sample Data

The database includes sample data:
- 6 services (Vinayak Interior's, Wardrobes, Kitchen, etc.)
- 5 portfolio projects with images
- 5 customer reviews
- Default website settings

## Admin Features

### Managing Projects
- Add/edit/delete projects
- Upload multiple images
- Set publish status and featured flag
- Organize with display order

### Managing Inquiries
- View all customer requests
- Update status (New, In Progress, Completed)
- Add admin notes
- Filter by status

### Managing Reviews
- Approve/reject customer reviews
- Feature reviews on homepage
- Delete inappropriate content

### Managing Services
- Enable/disable services
- Update pricing and descriptions
- Add process steps
- Control display order

### Website Settings
- Update hero text
- Edit contact information
- Manage social media links
- Update statistics

## Support

For issues or questions, contact the development team.

## License

Proprietary - All rights reserved
