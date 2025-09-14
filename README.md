# DMFL - Dallas Muslim Flag Football League

Official stats hub for Dallas Muslim Flag Football League Season 4 featuring live scores, standings, player statistics, and league information.

## Features

- **Premium Design**: Clean, minimalist interface with the DMFL color palette
- **Real-time Stats**: Live scoring and player statistics tracking
- **Team Management**: Complete team rosters and standings
- **Player Profiles**: Individual player stats and performance tracking
- **Admin Panel**: Draft import wizard and game statistics entry
- **Responsive**: Perfect experience on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, React Server Components
- **Styling**: Tailwind CSS with shadcn/ui components, Lucide React icons
- **Database**: Supabase (Postgres, Auth, RLS, Edge Functions)
- **Charts**: Recharts for data visualization
- **Validation**: Zod for input validation
- **State**: TanStack Query for client-side data fetching
- **File Processing**: SheetJS (xlsx) for draft imports
- **Testing**: Vitest for unit tests, Playwright for E2E testing
- **Deployment**: Vercel with GitHub Actions CI

## Design System

### Colors
- Canvas: #FFFFFF
- Ink: #0F172A  
- Muted text: #6B7280
- Lines: #E5E7EB
- Accent primary: #0F4C81
- Accent copper: #B45309 (used sparingly)

### Typography
- Font: Inter (14-16px base, tight line height for tables, relaxed for headings)
- Consistent spacing: container max-w-7xl, gap-6 desktop / gap-4 mobile
- Cards: p-5 md:p-6 with rounded-2xl and subtle shadows

### Icons
- Lucide React icons only (no emojis)
- Consistent sizes and weights throughout

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dmfl-mvp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Set up Supabase**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Start local development
   supabase start
   
   # Run migrations
   supabase db reset
   ```

5. **Seed the database**
   ```bash
   npx tsx scripts/seed.ts
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

### Core Tables
- `seasons` - League seasons
- `teams` - Team information  
- `players` - Player roster
- `rosters` - Team-player relationships
- `games` - Game schedule and results
- `player_stats_offense` - Individual offensive statistics
- `player_stats_defense` - Individual defensive statistics
- `team_stats` - Team game statistics
- `profiles` - User authentication and roles
- `audit_log` - Change tracking

### Views
- `v_player_season_offense` - Aggregated offensive stats by player/season
- `v_player_season_defense` - Aggregated defensive stats by player/season  
- `v_team_standings` - Team standings with W/L records
- `v_leaderboards` - Top performers by statistical category

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run E2E tests

## Admin Features

### Draft Import
- Upload CSV or XLSX files with draft results
- Map columns to database fields
- Validate data and preview before import
- Creates teams, players, and rosters automatically

### Game Statistics Entry  
- Select game and enter final scores
- Input per-player offensive and defensive stats
- Data validation and error checking
- Publish to update standings and leaderboards

### User Management
- Admin vs viewer role assignment
- Audit log of all changes
- Magic link authentication via Supabase

## Production Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Add environment variables
3. Deploy automatically on push to main

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and linting
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the DMFL administration.
