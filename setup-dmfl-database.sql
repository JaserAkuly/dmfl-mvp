-- ============================================================
-- DMFL Database Setup Script
-- Run this entire script in your Supabase SQL Editor
-- ============================================================

-- Create enums
CREATE TYPE game_status AS ENUM ('scheduled', 'live', 'final', 'postponed');
CREATE TYPE player_role AS ENUM ('captain', 'co_captain', 'player');
CREATE TYPE position AS ENUM ('QB', 'WR', 'RB', 'DB', 'LB', 'RUSH', 'FLEX');

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
    primary_position position,
    secondary_position position,
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

-- ============================================================
-- PART 2: CREATE VIEWS AND FUNCTIONS
-- ============================================================

-- Create RPC function for admin check
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (SELECT role = 'admin' FROM profiles WHERE user_id = auth.uid()),
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for player season offense stats
CREATE OR REPLACE VIEW v_player_season_offense AS
SELECT 
    p.id as player_id,
    p.first_name,
    p.last_name,
    p.primary_position,
    r.team_id,
    t.name as team_name,
    g.season_id,
    s.name as season_name,
    g.week,
    
    -- Passing stats
    SUM(pso.pass_att) as pass_att,
    SUM(pso.pass_comp) as pass_comp,
    CASE 
        WHEN SUM(pso.pass_att) > 0 
        THEN ROUND((SUM(pso.pass_comp)::DECIMAL / SUM(pso.pass_att)::DECIMAL) * 100, 1)
        ELSE 0 
    END as pass_comp_pct,
    SUM(pso.pass_yds) as pass_yds,
    SUM(pso.pass_tds) as pass_tds,
    SUM(pso.ints_thrown) as ints_thrown,
    
    -- Rushing stats
    SUM(pso.rush_att) as rush_att,
    SUM(pso.rush_yds) as rush_yds,
    SUM(pso.rush_tds) as rush_tds,
    CASE 
        WHEN SUM(pso.rush_att) > 0 
        THEN ROUND(SUM(pso.rush_yds)::DECIMAL / SUM(pso.rush_att)::DECIMAL, 1)
        ELSE 0 
    END as rush_avg,
    
    -- Receiving stats
    SUM(pso.targets) as targets,
    SUM(pso.receptions) as receptions,
    CASE 
        WHEN SUM(pso.targets) > 0 
        THEN ROUND((SUM(pso.receptions)::DECIMAL / SUM(pso.targets)::DECIMAL) * 100, 1)
        ELSE 0 
    END as catch_pct,
    SUM(pso.rec_yds) as rec_yds,
    SUM(pso.rec_tds) as rec_tds,
    CASE 
        WHEN SUM(pso.receptions) > 0 
        THEN ROUND(SUM(pso.rec_yds)::DECIMAL / SUM(pso.receptions)::DECIMAL, 1)
        ELSE 0 
    END as rec_avg,
    
    -- Total stats
    SUM(pso.two_pts) as two_pts,
    (SUM(pso.pass_tds) + SUM(pso.rush_tds) + SUM(pso.rec_tds)) as total_tds,
    COUNT(DISTINCT g.id) as games_played

FROM players p
JOIN rosters r ON p.id = r.player_id
JOIN teams t ON r.team_id = t.id
JOIN games g ON (g.home_team_id = t.id OR g.away_team_id = t.id) AND g.season_id = r.season_id
JOIN seasons s ON g.season_id = s.id
LEFT JOIN player_stats_offense pso ON pso.player_id = p.id AND pso.game_id = g.id AND pso.team_id = t.id
WHERE g.status = 'final'
GROUP BY p.id, p.first_name, p.last_name, p.primary_position, r.team_id, t.name, g.season_id, s.name, g.week;

-- Create view for player season defense stats  
CREATE OR REPLACE VIEW v_player_season_defense AS
SELECT 
    p.id as player_id,
    p.first_name,
    p.last_name,
    p.primary_position,
    r.team_id,
    t.name as team_name,
    g.season_id,
    s.name as season_name,
    g.week,
    
    -- Defense stats
    SUM(psd.tackles) as tackles,
    SUM(psd.sacks) as sacks,
    SUM(psd.interceptions) as interceptions,
    SUM(psd.deflections) as deflections,
    SUM(psd.ffumbles) as ffumbles,
    SUM(psd.fr) as fr,
    SUM(psd.safeties) as safeties,
    SUM(psd.td) as defensive_tds,
    COUNT(DISTINCT g.id) as games_played

FROM players p
JOIN rosters r ON p.id = r.player_id
JOIN teams t ON r.team_id = t.id
JOIN games g ON (g.home_team_id = t.id OR g.away_team_id = t.id) AND g.season_id = r.season_id
JOIN seasons s ON g.season_id = s.id
LEFT JOIN player_stats_defense psd ON psd.player_id = p.id AND psd.game_id = g.id AND psd.team_id = t.id
WHERE g.status = 'final'
GROUP BY p.id, p.first_name, p.last_name, p.primary_position, r.team_id, t.name, g.season_id, s.name, g.week;

-- Create materialized view for team standings
CREATE MATERIALIZED VIEW v_team_standings AS
WITH game_results AS (
    SELECT 
        g.season_id,
        g.home_team_id as team_id,
        CASE 
            WHEN g.home_score > g.away_score THEN 1
            WHEN g.home_score = g.away_score THEN 0
            ELSE 0
        END as wins,
        CASE 
            WHEN g.home_score < g.away_score THEN 1
            ELSE 0
        END as losses,
        CASE 
            WHEN g.home_score = g.away_score THEN 1
            ELSE 0
        END as ties,
        g.home_score as points_for,
        g.away_score as points_against
    FROM games g
    WHERE g.status = 'final'
    
    UNION ALL
    
    SELECT 
        g.season_id,
        g.away_team_id as team_id,
        CASE 
            WHEN g.away_score > g.home_score THEN 1
            WHEN g.away_score = g.home_score THEN 0
            ELSE 0
        END as wins,
        CASE 
            WHEN g.away_score < g.home_score THEN 1
            ELSE 0
        END as losses,
        CASE 
            WHEN g.away_score = g.home_score THEN 1
            ELSE 0
        END as ties,
        g.away_score as points_for,
        g.home_score as points_against
    FROM games g
    WHERE g.status = 'final'
),
team_totals AS (
    SELECT 
        gr.season_id,
        gr.team_id,
        SUM(gr.wins) as wins,
        SUM(gr.losses) as losses,
        SUM(gr.ties) as ties,
        SUM(gr.points_for) as points_for,
        SUM(gr.points_against) as points_against,
        (SUM(gr.points_for) - SUM(gr.points_against)) as point_diff,
        COUNT(*) as games_played
    FROM game_results gr
    GROUP BY gr.season_id, gr.team_id
)
SELECT 
    tt.season_id,
    tt.team_id,
    t.name as team_name,
    t.slug as team_slug,
    tt.wins,
    tt.losses, 
    tt.ties,
    tt.games_played,
    tt.points_for,
    tt.points_against,
    tt.point_diff,
    CASE 
        WHEN tt.games_played > 0 
        THEN ROUND(tt.points_for::DECIMAL / tt.games_played::DECIMAL, 1)
        ELSE 0 
    END as avg_points_for,
    CASE 
        WHEN tt.games_played > 0 
        THEN ROUND(tt.points_against::DECIMAL / tt.games_played::DECIMAL, 1)
        ELSE 0 
    END as avg_points_against,
    CASE 
        WHEN tt.games_played > 0 
        THEN ROUND(((tt.wins + (tt.ties * 0.5))::DECIMAL / tt.games_played::DECIMAL) * 100, 1)
        ELSE 0 
    END as win_pct
FROM team_totals tt
JOIN teams t ON tt.team_id = t.id
ORDER BY win_pct DESC, point_diff DESC, points_for DESC;

-- Create materialized view for leaderboards
CREATE MATERIALIZED VIEW v_leaderboards AS
WITH offense_leaders AS (
    SELECT 
        'pass_yds' as category,
        'offense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        pass_yds as stat_value,
        games_played
    FROM v_player_season_offense
    WHERE pass_yds > 0
    
    UNION ALL
    
    SELECT 
        'pass_tds' as category,
        'offense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        pass_tds as stat_value,
        games_played
    FROM v_player_season_offense
    WHERE pass_tds > 0
    
    UNION ALL
    
    SELECT 
        'rush_yds' as category,
        'offense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        rush_yds as stat_value,
        games_played
    FROM v_player_season_offense
    WHERE rush_yds > 0
    
    UNION ALL
    
    SELECT 
        'rec_yds' as category,
        'offense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        rec_yds as stat_value,
        games_played
    FROM v_player_season_offense
    WHERE rec_yds > 0
    
    UNION ALL
    
    SELECT 
        'rec_tds' as category,
        'offense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        rec_tds as stat_value,
        games_played
    FROM v_player_season_offense
    WHERE rec_tds > 0
    
    UNION ALL
    
    SELECT 
        'total_tds' as category,
        'offense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        total_tds as stat_value,
        games_played
    FROM v_player_season_offense
    WHERE total_tds > 0
),
defense_leaders AS (
    SELECT 
        'tackles' as category,
        'defense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        tackles as stat_value,
        games_played
    FROM v_player_season_defense
    WHERE tackles > 0
    
    UNION ALL
    
    SELECT 
        'sacks' as category,
        'defense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        sacks as stat_value,
        games_played
    FROM v_player_season_defense
    WHERE sacks > 0
    
    UNION ALL
    
    SELECT 
        'interceptions' as category,
        'defense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        interceptions as stat_value,
        games_played
    FROM v_player_season_defense
    WHERE interceptions > 0
    
    UNION ALL
    
    SELECT 
        'defensive_tds' as category,
        'defense' as type,
        player_id,
        first_name,
        last_name,
        primary_position,
        team_id,
        team_name,
        season_id,
        season_name,
        week,
        defensive_tds as stat_value,
        games_played
    FROM v_player_season_defense
    WHERE defensive_tds > 0
)
SELECT * FROM offense_leaders
UNION ALL
SELECT * FROM defense_leaders;

-- Create indexes on materialized views
CREATE INDEX idx_v_team_standings_season ON v_team_standings(season_id);
CREATE INDEX idx_v_team_standings_win_pct ON v_team_standings(win_pct DESC);
CREATE INDEX idx_v_leaderboards_category_season ON v_leaderboards(category, season_id);
CREATE INDEX idx_v_leaderboards_stat_value ON v_leaderboards(category, stat_value DESC);

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW v_team_standings;
    REFRESH MATERIALIZED VIEW v_leaderboards;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh materialized views when stats change
CREATE OR REPLACE FUNCTION trigger_refresh_views()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM refresh_materialized_views();
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_views_on_game_update
    AFTER INSERT OR UPDATE OR DELETE ON games
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_refresh_views();

CREATE TRIGGER refresh_views_on_offense_stats_update
    AFTER INSERT OR UPDATE OR DELETE ON player_stats_offense
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_refresh_views();

CREATE TRIGGER refresh_views_on_defense_stats_update
    AFTER INSERT OR UPDATE OR DELETE ON player_stats_defense
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_refresh_views();

-- ============================================================
-- PART 3: ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats_offense ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats_defense ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (read-only data)
CREATE POLICY "Public read access" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access" ON rosters FOR SELECT USING (true);
CREATE POLICY "Public read access" ON games FOR SELECT USING (true);
CREATE POLICY "Public read access" ON player_stats_offense FOR SELECT USING (true);
CREATE POLICY "Public read access" ON player_stats_defense FOR SELECT USING (true);
CREATE POLICY "Public read access" ON team_stats FOR SELECT USING (true);

-- Admin-only policies for write operations
CREATE POLICY "Admin insert access" ON seasons FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update access" ON seasons FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access" ON seasons FOR DELETE USING (is_admin());

CREATE POLICY "Admin insert access" ON teams FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update access" ON teams FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access" ON teams FOR DELETE USING (is_admin());

CREATE POLICY "Admin insert access" ON players FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update access" ON players FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access" ON players FOR DELETE USING (is_admin());

CREATE POLICY "Admin insert access" ON rosters FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update access" ON rosters FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access" ON rosters FOR DELETE USING (is_admin());

CREATE POLICY "Admin insert access" ON games FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update access" ON games FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access" ON games FOR DELETE USING (is_admin());

CREATE POLICY "Admin insert access" ON player_stats_offense FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update access" ON player_stats_offense FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access" ON player_stats_offense FOR DELETE USING (is_admin());

CREATE POLICY "Admin insert access" ON player_stats_defense FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update access" ON player_stats_defense FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access" ON player_stats_defense FOR DELETE USING (is_admin());

CREATE POLICY "Admin insert access" ON team_stats FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update access" ON team_stats FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access" ON team_stats FOR DELETE USING (is_admin());

-- Profile policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage all profiles" ON profiles FOR ALL USING (is_admin());

-- Audit log policies
CREATE POLICY "Admin can view audit logs" ON audit_log FOR SELECT USING (is_admin());
CREATE POLICY "System can insert audit logs" ON audit_log FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant access to views
GRANT SELECT ON v_player_season_offense TO anon, authenticated;
GRANT SELECT ON v_player_season_defense TO anon, authenticated;
GRANT SELECT ON v_team_standings TO anon, authenticated;
GRANT SELECT ON v_leaderboards TO anon, authenticated;

-- Create trigger for auto-creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create audit log trigger function
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    actor_id UUID;
BEGIN
    -- Get current user
    actor_id := auth.uid();
    
    -- Insert audit log entry
    INSERT INTO audit_log (actor, action, entity, entity_id, before, after)
    VALUES (
        actor_id,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to key tables
CREATE TRIGGER audit_seasons AFTER INSERT OR UPDATE OR DELETE ON seasons
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_teams AFTER INSERT OR UPDATE OR DELETE ON teams
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_players AFTER INSERT OR UPDATE OR DELETE ON players
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_rosters AFTER INSERT OR UPDATE OR DELETE ON rosters
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_games AFTER INSERT OR UPDATE OR DELETE ON games
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_player_stats_offense AFTER INSERT OR UPDATE OR DELETE ON player_stats_offense
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_player_stats_defense AFTER INSERT OR UPDATE OR DELETE ON player_stats_defense
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- ============================================================
-- SETUP COMPLETE!
-- Your DMFL database is ready to use.
-- 
-- Next steps:
-- 1. Run the seed script: `pnpm run seed` 
-- 2. Test your app: `pnpm run dev`
-- ============================================================