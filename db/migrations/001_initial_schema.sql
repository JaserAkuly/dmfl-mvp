-- Create enums
CREATE TYPE game_status AS ENUM ('scheduled', 'live', 'final', 'postponed');
CREATE TYPE player_role AS ENUM ('captain', 'co_captain', 'player');
CREATE TYPE player_position AS ENUM ('QB', 'WR', 'RB', 'DB', 'LB', 'RUSH', 'FLEX');

-- Create seasons table
CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    ordinal INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color_primary TEXT NOT NULL,
    color_secondary TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    primary_position player_position,
    secondary_position player_position,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rosters table
CREATE TABLE rosters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    jersey_number INTEGER,
    role player_role NOT NULL DEFAULT 'player',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(season_id, team_id, player_id),
    UNIQUE(season_id, team_id, jersey_number)
);

-- Create games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    week INTEGER NOT NULL,
    kickoff_at TIMESTAMPTZ NOT NULL,
    location TEXT,
    status game_status NOT NULL DEFAULT 'scheduled',
    home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(season_id, week, home_team_id, away_team_id),
    CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

-- Create player_stats_offense table
CREATE TABLE player_stats_offense (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    pass_att INTEGER DEFAULT 0,
    pass_comp INTEGER DEFAULT 0,
    pass_yds INTEGER DEFAULT 0,
    pass_tds INTEGER DEFAULT 0,
    ints_thrown INTEGER DEFAULT 0,
    rush_att INTEGER DEFAULT 0,
    rush_yds INTEGER DEFAULT 0,
    rush_tds INTEGER DEFAULT 0,
    receptions INTEGER DEFAULT 0,
    targets INTEGER DEFAULT 0,
    rec_yds INTEGER DEFAULT 0,
    rec_tds INTEGER DEFAULT 0,
    two_pts INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, team_id, player_id)
);

-- Create player_stats_defense table
CREATE TABLE player_stats_defense (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    tackles INTEGER DEFAULT 0,
    sacks INTEGER DEFAULT 0,
    interceptions INTEGER DEFAULT 0,
    deflections INTEGER DEFAULT 0,
    ffumbles INTEGER DEFAULT 0,
    fr INTEGER DEFAULT 0,
    safeties INTEGER DEFAULT 0,
    td INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, team_id, player_id)
);

-- Create team_stats table
CREATE TABLE team_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    points_for INTEGER NOT NULL,
    points_against INTEGER NOT NULL,
    turnovers_forced INTEGER DEFAULT 0,
    turnovers_lost INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, team_id)
);

-- Create profiles table for user management
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'viewer')) DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_log table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor UUID REFERENCES profiles(user_id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID NOT NULL,
    before JSONB,
    after JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_seasons_active ON seasons(active);
CREATE INDEX idx_teams_season ON teams(season_id);
CREATE INDEX idx_teams_slug ON teams(slug);
CREATE INDEX idx_rosters_season_team ON rosters(season_id, team_id);
CREATE INDEX idx_rosters_player ON rosters(player_id);
CREATE INDEX idx_games_season_week ON games(season_id, week);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_teams ON games(home_team_id, away_team_id);
CREATE INDEX idx_player_stats_offense_game ON player_stats_offense(game_id);
CREATE INDEX idx_player_stats_offense_player ON player_stats_offense(player_id);
CREATE INDEX idx_player_stats_defense_game ON player_stats_defense(game_id);
CREATE INDEX idx_player_stats_defense_player ON player_stats_defense(player_id);
CREATE INDEX idx_team_stats_game ON team_stats(game_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_stats_offense_updated_at BEFORE UPDATE ON player_stats_offense
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_stats_defense_updated_at BEFORE UPDATE ON player_stats_defense
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_stats_updated_at BEFORE UPDATE ON team_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();