# Orti. - Collaborative Calendar for Partners

A real-time shared calendar system built for indie makers and business partners to collaborate efficiently.

## Features

✅ **Google OAuth Authentication** - Secure login with Google  
✅ **Shared Calendars** - Create and manage multiple calendars  
✅ **Invite System** - Unique collision-checked invite codes (e.g., ABC-123)  
✅ **Weekly View** - Monday-Sunday calendar grid (8:00-23:00)  
✅ **Real-time Updates** - Instant synchronization using Supabase Realtime  
✅ **Event Management** - Create, edit, and delete events  
✅ **Daily Notes** - Add notes for each day  
✅ **Turkish UI** - All interface text in Turkish  

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google Provider)
- **Real-time:** Supabase Realtime
- **State:** React Query (TanStack Query)
- **Date Handling:** date-fns

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon/public key
4. Go to SQL Editor and run the schema from `supabase/schema.sql`

### 3. Configure Google OAuth

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Google provider
3. Follow instructions to set up Google OAuth credentials
4. Add authorized redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
orti/
├── app/
│   ├── actions/           # Server actions
│   │   ├── calendar.ts    # Calendar CRUD
│   │   └── events.ts      # Event CRUD
│   ├── auth/              # Auth callback
│   ├── dashboard/         # Dashboard pages
│   │   ├── [calendarId]/  # Individual calendar view
│   │   └── layout.tsx     # Dashboard layout with sidebar
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── calendar/          # Calendar components
│   │   ├── calendar-view.tsx      # Main calendar with real-time
│   │   ├── create-calendar-dialog.tsx
│   │   ├── event-dialog.tsx
│   │   ├── join-calendar-dialog.tsx
│   │   └── week-grid.tsx  # Weekly grid component
│   ├── dashboard/
│   │   └── sidebar.tsx    # Dashboard sidebar
│   ├── ui/                # shadcn/ui components
│   └── providers.tsx      # React Query provider
├── lib/
│   ├── supabase/          # Supabase clients
│   │   ├── client.ts      # Browser client
│   │   └── server.ts      # Server client
│   ├── calendar-utils.ts  # Date utilities
│   ├── invite-code.ts     # Invite code generation
│   └── utils.ts           # General utilities
├── types/
│   └── database.ts        # Supabase types
├── supabase/
│   └── schema.sql         # Database schema
└── middleware.ts          # Auth middleware
```

## Key Features Implementation

### Invite Code with Collision Check

The invite code generation (`lib/invite-code.ts`) implements a critical feature:
- Generates 6-character codes (format: ABC-123)
- **Checks database for collisions** before returning
- Retries up to 10 times if collision detected
- Ensures uniqueness before calendar creation

### Real-time Synchronization

Using Supabase Realtime (`components/calendar/calendar-view.tsx`):
- Subscribes to INSERT, UPDATE, DELETE events
- Automatically updates UI when changes occur
- No manual refresh needed

### Weekly Calendar View

The calendar grid (`components/calendar/week-grid.tsx`):
- Strictly starts on Monday (weekStartsOn: 1)
- Displays 7 days (Mon-Sun)
- Hourly slots from 8:00 to 23:00
- Click to create events
- Today highlighting

## Database Schema

The app uses 5 main tables:

1. **profiles** - User profiles (extends auth.users)
2. **calendars** - Calendar metadata and invite codes
3. **calendar_members** - Calendar membership (many-to-many)
4. **events** - Calendar events
5. **daily_notes** - Daily notes per calendar

All tables have Row Level Security (RLS) policies enabled.

## Building for Production

```bash
npm run build
npm run start
```

## Turkish UI Text

All user-facing text is in Turkish:
- "Giriş Yap" - Login
- "Yeni Takvim" - New Calendar
- "Takvime Katıl" - Join Calendar
- "Davet Kodu" - Invite Code
- etc.

## License

MIT

## Author

Built for indie makers and partners who need simple, effective calendar collaboration.
