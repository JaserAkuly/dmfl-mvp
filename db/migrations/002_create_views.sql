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