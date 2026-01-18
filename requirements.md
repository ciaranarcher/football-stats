# Application Requirements

## Core Product Requirements

### 1. Team and Admin Setup
- Support configuring multiple teams, each with:
  - Team name.
  - Division.
  - Status (e.g. active/inactive). [web:6]
- For each team, provide its own admin configuration section (own URL) to:
  - Add new players.
  - Edit existing players.
  - Deactivate or archive players instead of hard-deleting.
- Each player record must include:
  - Unique identifier.
  - Name.
  - Optional metadata such as preferred position and shirt number. [web:6]

### 2. Match Input
- Allow creating matches for a selected team against a named opponent.
- Capture basic match metadata:
  - Date.
  - Opponent name.
  - Optional competition or friendly flag.
  - Optional notes field for additional context (e.g. "penalty shootout", "cup final").
  - Optional manual result override (our score vs opponent score) for cases where automatic calculation doesn't apply.
- For each goal scored by our team, record:
  - Scoring player (from that team's squad).
  - Optional minute of goal.
  - Goal type, restricted to:
    - Normal goal.
    - Penalty goal, marked as `P`.
- Match results are automatically calculated from our goals vs opponent goals (when entered), but can be manually overridden if needed.
- Support editing and deleting:
  - Entire matches.
  - Individual goal entries within a match.

### 3. Match and Team Stats Pages
- Provide a **team-level stats page** (unique URL per team, e.g. `/teams/{teamId}`) that shows:
  - List of all matches for that team.
  - Result per match (win/draw/loss) based on manual input or automatic calculation.
  - Goals scored by our team per match.
  - Aggregate record (e.g. W–D–L totals).
  - Win %, Loss %, Draw %.
- Provide a **match detail page** (unique URL per match, e.g. `/teams/{teamId}/matches/{matchId}`) that shows:
  - Opponent, date, competition, and notes.
  - Match result.
  - All goals scored by our team with:
    - Scoring player.
    - Goal type flag (`P` for penalties).
    - Optional minute.
- Ensure every stats and input view has a stable, shareable URL, including:
  - Team admin config page: `/teams/{teamId}/admin`.
  - Team stats page: `/teams/{teamId}`.
  - Match detail pages: `/teams/{teamId}/matches/{matchId}`.

### 4. Player Stats
- Provide a **player stats page** per team (unique URL, e.g. `/teams/{teamId}/players/{playerId}`) showing:
  - Player name and basic info.
  - Total goals across all matches for that team.
  - Breakdown of goals by type:
    - Normal goals.
    - Penalty goals.
- From the team stats and match detail pages, link through to the relevant player stats pages.

### 5. Basic User Experience
- Simple, mobile-friendly web UI with:
  - Navigation between team list, team stats, admin, and match pages.
  - Clear indication of which team is currently being viewed or edited.
- Display clear labels or tags for goal types:
  - Show `P` for penalties in all relevant goal lists.
- Provide basic validation and error messages on match and player input forms.

---

## Core Technical Requirements

### 1. Overall Architecture
- Single web application built with **Next.js** and **React**.
- Deployed on **Vercel** with serverless API routes.
- Styled with **Tailwind CSS** for a responsive, mobile-friendly UI.
- Separation of concerns:
  - Frontend for UI and routing.
  - Lightweight backend layer (Next.js API routes) exposing APIs for reading/writing JSON data and computing aggregates.

### 2. Data Storage (JSON-Based)
- Use JSON files for all persistent data (no external database):
  - `teams.json`
    - Stores all teams and their metadata.
  - `players.json`
    - Stores players keyed by team or includes teamId on each player.
  - `matches.json`
    - Stores matches and embedded goal records for each match.
- Define stable schemas for:
  - Team:
    - `id`, `name`, `division`, `status`.
  - Player:
    - `id`, `teamId`, `name`, `status` (active/inactive), optional `position`, `number`.
  - Match:
    - `id`, `teamId`, `opponent`, `date`, optional `competition`, optional `notes`, optional `ourScore`, optional `opponentScore`, list of goals.
  - Goal:
    - `id`, `matchId`, `teamId`, `playerId`, `minute` (optional), `type` in `["NORMAL", "PENALTY"]`.
- Implement basic safeguards against corrupted JSON (e.g. try/catch around JSON parsing and writing).

### 3. Backend/API Layer
- Implement server-side endpoints for:
  - Teams:
    - Get all teams.
    - Get single team by `teamId`.
    - Create/update team.
  - Players:
    - Get players by `teamId`.
    - Create/update/deactivate player for a team.
  - Matches:
    - Get matches by `teamId`.
    - Get single match by `matchId`.
    - Create/update/delete match.
  - Stats:
    - Team-level aggregates (W/D/L, GF/GA).
    - Per-player goal tallies including breakdown by type. [web:10]
- All write operations (create/update/delete) update the JSON files on disk in a consistent, atomic way where possible.

### 4. Routing and URLs
- Use file-based routing to ensure stable, shareable URLs for:
  - Team list: `/teams`.
  - Team stats: `/teams/{teamId}`.
  - Team admin: `/teams/{teamId}/admin`.
  - Match detail: `/teams/{teamId}/matches/{matchId}`.
  - Player stats: `/teams/{teamId}/players/{playerId}`.
- Ensure that direct navigation (hard refresh) on any of these URLs loads the correct data from JSON storage.

### 5. Frontend Implementation
- Build the UI using **Next.js** with **React** components and **Tailwind CSS** for styling.
- Implement views:
  - Team list and selection.
  - Team stats view with match list and basic aggregates.
  - Match detail view with goal list and type flags (`P` for penalties).
  - Team admin view for player management.
  - Player stats view showing per-player goal counts and breakdown.
- Use client-side forms that call the backend APIs (Next.js API routes) for:
  - Creating/updating players.
  - Creating/updating matches and goals.

### 6. Environment and Deployment
- Application deployed on **Vercel** via standard Git-based workflow (push to main branch triggers automatic build and deploy).
- Use environment variables (where needed) for configuration that differs across environments.
- Provide a minimal setup/README indicating:
  - How to install dependencies (`npm install`).
  - How to run the app locally (`npm run dev`).
  - How to deploy to Vercel.
