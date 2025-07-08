# Celebrity Booking System

A full-stack celebrity booking platform built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### For Users
- **Celebrity Catalog**: Browse celebrities by categories (Actress, Musician, Model, Athlete, Influencer, Comedian)
- **Detailed Profiles**: View celebrity information, ratings, specialties, and social media
- **Booking System**: Multi-step booking process with event details and payments
- **Payment Options**: Bank transfer, USDT, Bitcoin (BTC), and Ethereum (ETH)
- **User Authentication**: Secure sign-up and sign-in
- **Booking Management**: View and track personal bookings

### For Admins
- **Admin Authentication**: Secure admin login with secret key
- **Booking Management**: Approve/reject bookings and add admin notes
- **Celebrity Management**: Full CRUD operations for celebrity profiles
- **Analytics Dashboard**: View booking statistics and revenue

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Backend**: Supabase (Database, Auth, Real-time)
- **Deployment**: Express.js server for production
- **State Management**: React Query, Context API

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd celebrity-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`

4. **Production build and serve**
   ```bash
   npm run build
   npm start
   ```
   Access the app at `http://localhost:3000`

## Admin Access

### Creating an Admin Account

1. Navigate to `/admin/auth`
2. Click "Create Admin" tab
3. Enter the secret key: `CELEBRITY_ADMIN_2024`
4. Provide admin email and password
5. Complete email verification

### Admin Routes

- **Admin Login**: `/admin/auth`
- **Admin Dashboard**: `/admin`
  - Booking Management tab: Approve/reject bookings
  - Celebrity Management tab: Add/edit/delete celebrities

### Admin Features

- **Booking Management**:
  - View all user bookings
  - Approve or reject pending bookings
  - Add admin notes to bookings
  - Filter bookings by status

- **Celebrity Management**:
  - Add new celebrities with full profile information
  - Edit existing celebrity details
  - Update availability status
  - Manage social media links and specialties

## User Routes

- **Homepage**: `/` - Celebrity catalog and filtering
- **Celebrity Details**: `/celebrity/:id` - Individual celebrity profiles
- **Booking**: `/booking/:id` - Multi-step booking process
- **User Auth**: `/auth` - Sign up/sign in
- **My Bookings**: `/my-bookings` - User's booking history

## Payment Methods

The system supports multiple payment methods:
- **Bank Transfer**: Traditional bank wire transfer
- **USDT**: Tether cryptocurrency
- **BTC**: Bitcoin cryptocurrency  
- **ETH**: Ethereum cryptocurrency

## Database Schema

### Tables
- **profiles**: User profiles with roles (admin/user)
- **bookings**: Booking records with payment and status tracking

### Key Features
- Row Level Security (RLS) policies
- Admin role-based access control
- Automatic profile creation on user signup
- Booking status workflow (pending → approved/rejected → completed)

## Development Commands

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build
npm start           # Start production server
npm run serve       # Build and start production server

# Type checking
npx tsc --noEmit     # Type check without building
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── CelebrityCard.tsx
│   ├── CelebrityFilter.tsx
│   └── CelebrityManagement.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── data/              # Static data
│   └── celebrities.ts
├── hooks/             # Custom React hooks
├── integrations/      # Third-party integrations
│   └── supabase/
├── lib/               # Utility functions
├── pages/             # Route components
│   ├── Index.tsx
│   ├── Auth.tsx
│   ├── AdminAuth.tsx
│   ├── AdminDashboard.tsx
│   ├── CelebrityDetails.tsx
│   ├── Booking.tsx
│   └── MyBookings.tsx
└── styles/            # Global styles
```

## Environment Setup

The application connects to Supabase for backend services. The configuration is already set up in:
- `src/integrations/supabase/client.ts`
- `supabase/migrations/` - Database schema

## Deployment

### Using Express Server (Recommended)

1. Build the project: `npm run build`
2. Start the server: `npm start`
3. The server serves the React app and provides API endpoints

### Using Static Hosting

The built files in `dist/` can be deployed to any static hosting service like:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- GitHub Pages

## Security Features

- Row Level Security (RLS) on all database tables
- Admin-only access to management features
- Secure authentication with Supabase
- Input validation and sanitization
- CORS and security headers in production server

## Admin Secret Key

**Default Admin Secret Key**: `CELEBRITY_ADMIN_2024`

To change the secret key, edit the `ADMIN_SECRET_KEY` constant in `src/pages/AdminAuth.tsx`.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify database permissions in Supabase dashboard
3. Ensure all environment variables are configured
4. Review the browser network tab for API errors

## License

This project is licensed under the MIT License.# reactjs-CelebrityBookings
