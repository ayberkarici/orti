## NEXT STEPS TO GET ORTI. RUNNING

You've successfully set up the Orti. project structure! Here's what to do next:

### 1. Set up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Once ready, go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

### 2. Create Your Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste it into the SQL Editor and click **Run**
4. This will create all tables, indexes, RLS policies, and triggers

### 3. Configure Google OAuth

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and toggle it on
3. You'll need to:
   - Create a Google Cloud Project
   - Enable Google OAuth
   - Get your Client ID and Client Secret
   - Add them to Supabase
4. Add authorized redirect URL in Google Console:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

### 4. Set Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual Supabase project URL and anon key from Step 1.

### 5. Start the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### 6. Test the Application

1. Land on the homepage
2. Click "Giriş Yap" (Login)
3. Sign in with Google
4. Create your first calendar
5. Copy the invite code
6. (Optional) Share with a partner to test collaboration

---

## Troubleshooting

**Can't login?**
- Make sure Google OAuth is properly configured in Supabase
- Check that redirect URLs match
- Verify environment variables are set

**Database errors?**
- Ensure you ran the full schema.sql in Supabase SQL Editor
- Check RLS policies are enabled

**Real-time not working?**
- Verify Supabase Realtime is enabled for your tables
- Check browser console for connection errors

---

## Features Implemented

✅ Google OAuth Authentication  
✅ Unique Invite Code Generation (with collision checking!)  
✅ Create & Join Calendars  
✅ Weekly Calendar View (Monday-Sunday, 8:00-23:00)  
✅ Create, Edit, Delete Events  
✅ Real-time Synchronization (Supabase Realtime)  
✅ Daily Notes (per day)  
✅ Turkish UI  
✅ Responsive Design  
✅ Row Level Security  

---

## Project Architecture Highlights

- **Server Components** by default for better performance
- **Client Components** only where interaction is needed
- **Server Actions** for all mutations
- **Real-time Subscriptions** for live updates
- **Type-safe** database queries with generated types
- **Protected Routes** via middleware
- **RLS Policies** for multi-tenant security

Happy coding! 🚀
