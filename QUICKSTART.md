# Quick Start Guide - Get Orti Running in 5 Minutes

## Prerequisites
- Node.js 18+ installed
- npm installed
- A Supabase account (free tier works!)

## Step-by-Step

### 1️⃣ Supabase Setup (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name (e.g., "orti-calendar")
4. Set a database password (save it!)
5. Wait ~2 minutes for provisioning

### 2️⃣ Run Database Schema (30 seconds)

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open `supabase/schema.sql` from this project
4. Copy the entire file
5. Paste into Supabase SQL Editor
6. Click **RUN** (bottom right)
7. You should see "Success. No rows returned"

### 3️⃣ Get API Keys (30 seconds)

1. In Supabase, go to **Settings** (gear icon) → **API**
2. Find these two values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 4️⃣ Set Environment Variables (30 seconds)

1. In your project folder, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and paste your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-key-here
   ```

### 5️⃣ Configure Google OAuth (1 minute)

**In Supabase:**
1. Go to **Authentication** → **Providers**
2. Find **Google** and toggle it ON
3. Click "Add Google"

**Quick Option - Use Supabase's Development Keys:**
- For testing, you can use Supabase's built-in Google OAuth
- Just enable it and it works immediately!
- For production, you'll need your own Google OAuth app

### 6️⃣ Start the App (10 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎉 Test Your Setup

1. **Landing Page** - You should see the Orti homepage
2. **Click "Giriş Yap"** - Login button
3. **Sign in with Google** - Use your Google account
4. **Dashboard** - You'll be redirected after login
5. **Create Calendar** - Click "Yeni Takvim"
6. **Name it** - e.g., "Test Calendar"
7. **See Invite Code** - e.g., "ABC-123"
8. **Calendar View** - Click on the calendar in sidebar
9. **Create Event** - Click any time slot
10. **Done!** 🚀

---

## 🧪 Test Real-time Sync

1. Open the app in **two different browsers** (or one normal + one incognito)
2. Sign in with **two different Google accounts**
3. In Browser 1: Create a calendar, get invite code
4. In Browser 2: Join that calendar using the code
5. In Browser 1: Create an event
6. **Watch Browser 2** - the event appears instantly! ✨

---

## Common Issues

### "Can't connect to Supabase"
- Check your `.env.local` file exists
- Verify the URL and key are correct
- Make sure there are no extra spaces

### "Google login doesn't work"
- In Supabase: Authentication → Providers → Make sure Google is enabled
- For development, use Supabase's default Google OAuth

### "Database error"
- Make sure you ran the full `schema.sql`
- Check the SQL Editor for any error messages
- Verify all tables were created

### "RLS policy error"
- The schema.sql includes all RLS policies
- If you see this, you may have only run part of the schema
- Re-run the entire schema.sql file

---

## Production Deployment

When ready to deploy:

### Option 1: Vercel (Recommended)
```bash
npm run build
# Connect to Vercel via their dashboard or CLI
```

### Option 2: Any Node.js host
```bash
npm run build
npm run start
```

**Don't forget:**
- Set environment variables in production
- Set up your own Google OAuth app (not Supabase's dev keys)
- Add production URL to Google OAuth authorized redirect URIs
- Add production URL to Supabase Auth redirect URLs

---

## Need Help?

Check these files:
- `README.md` - Full documentation
- `SETUP.md` - Detailed setup instructions
- `BUILD_SUMMARY.md` - What was built
- `CHECKLIST.md` - Feature checklist

---

**Total Time:** ~5 minutes to get running! ⚡
