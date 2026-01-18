# Football Stats Tracker

A comprehensive Next.js application for tracking football team statistics, player performance, and match results.

## Features

- **Team Management**: Create and manage multiple football teams
- **Player Management**: Add players to teams, track active/inactive status
- **Match Recording**: Record match results with detailed goal information
- **Statistics**: Automatically calculated team and player statistics
- **Goal Tracking**: Track goals by player, including penalties and match minutes
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**:
  - Development: Local JSON files
  - Production: Vercel Blob Storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd football-stats
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development

The application will use local JSON files stored in `src/data/` for data persistence during development. These files are automatically created when you first run the application.

## Project Structure

```
football-stats/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/                      # API routes
│   │   │   ├── teams/               # Team CRUD operations
│   │   │   ├── players/             # Player CRUD operations
│   │   │   └── matches/             # Match CRUD operations
│   │   ├── teams/                   # Team pages
│   │   │   ├── [teamId]/           # Team detail & match pages
│   │   │   └── new/                # Create team
│   │   ├── layout.tsx              # Root layout with navigation
│   │   └── page.tsx                # Home page (redirects to teams)
│   ├── components/                  # React components
│   │   ├── ui/                     # Reusable UI components
│   │   ├── teams/                  # Team-specific components
│   │   ├── players/                # Player-specific components
│   │   └── matches/                # Match-specific components
│   ├── lib/
│   │   ├── db/                     # Data access layer
│   │   │   ├── storage.ts         # Storage abstraction
│   │   │   ├── teams.ts           # Team operations
│   │   │   ├── players.ts         # Player operations
│   │   │   └── matches.ts         # Match operations
│   │   ├── stats/                  # Statistics calculations
│   │   │   ├── team-stats.ts
│   │   │   └── player-stats.ts
│   │   ├── types.ts               # TypeScript type definitions
│   │   └── utils.ts               # Utility functions
│   └── data/                       # Local JSON files (dev only)
│       ├── teams.json
│       ├── players.json
│       └── matches.json
├── public/                         # Static assets
├── tailwind.config.ts             # Tailwind configuration
├── next.config.js                 # Next.js configuration
└── package.json
```

## Data Model

### Team
- ID (UUID)
- Name
- Division
- Status (active/inactive)
- Created/Updated timestamps

### Player
- ID (UUID)
- Team ID
- Name
- Position (optional)
- Number (optional)
- Status (active/inactive)
- Created/Updated timestamps

### Match
- ID (UUID)
- Team ID
- Opponent
- Date
- Competition (optional)
- Notes (optional)
- Manual score override (optional)
- Goals (embedded)
- Created/Updated timestamps

### Goal
- ID (UUID)
- Match ID
- Team ID
- Player ID
- Minute (optional)
- Type (NORMAL/PENALTY)

## Key Features

### Team Statistics
- Win/Draw/Loss record
- Win percentage
- Total matches played
- Goals for/against
- Goal difference

### Player Statistics
- Total goals scored
- Normal goals vs penalties
- Matches played

### Match Details
- Automatic result calculation (Win/Draw/Loss)
- Goal-by-goal breakdown
- Player credit for each goal
- Penalty indicators
- Match notes

## API Routes

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team
- `GET /api/teams/[teamId]` - Get team
- `PATCH /api/teams/[teamId]` - Update team

### Players
- `GET /api/players?teamId={id}` - List players for team
- `POST /api/players` - Create player
- `GET /api/players/[playerId]` - Get player
- `PATCH /api/players/[playerId]` - Update player

### Matches
- `GET /api/matches?teamId={id}` - List matches for team
- `POST /api/matches` - Create match with goals
- `GET /api/matches/[matchId]` - Get match with result
- `PATCH /api/matches/[matchId]` - Update match
- `DELETE /api/matches/[matchId]` - Delete match

## Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js settings

3. Configure Environment (if needed):
   - Vercel Blob Storage is automatically provisioned
   - No additional environment variables needed for basic setup

4. Deploy:
   - Click "Deploy"
   - Your app will be live in minutes at `https://<your-project>.vercel.app`

### Automatic Deployments
- Every push to the main branch will trigger a new deployment
- Pull requests create preview deployments

## Storage

### Development (Local)
- Data is stored in JSON files in `src/data/`
- Files are created automatically on first run
- Atomic writes prevent data corruption

### Production (Vercel)
- Data is stored in Vercel Blob Storage
- Automatic failover and redundancy
- No code changes needed - automatically detected via `NODE_ENV`

## Design Decisions

1. **Server-Side Rendering**: All pages use SSR for shareable URLs and SEO
2. **Embedded Goals**: Goals stored within match objects for simplicity
3. **Calculated Stats**: Statistics computed on-demand (not cached)
4. **Soft Delete**: Players marked inactive, never deleted (preserves history)
5. **Auto Result Calculation**: Match results calculated from goals unless manually overridden
6. **UUID IDs**: Unique identifiers for all entities

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Support

Fully responsive design optimized for:
- Mobile phones (375px+)
- Tablets (768px+)
- Desktop (1024px+)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own teams!

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

## Future Enhancements

Potential features for future releases:
- Player photos
- Match formations
- Advanced statistics (assists, cards, etc.)
- Season management
- Export to CSV/PDF
- Team comparison
- Historical trends
- Authentication and multi-user support

## Acknowledgments

Built with Next.js 14, React, TypeScript, and Tailwind CSS.
