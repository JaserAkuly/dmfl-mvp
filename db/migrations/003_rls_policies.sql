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