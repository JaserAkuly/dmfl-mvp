import { createAdminClient } from '@/lib/supabase/server'

const supabase = createAdminClient()

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Create Season 4
    console.log('Creating Season 4...')
    const { data: season, error: seasonError } = await supabase
      .from('seasons')
      .insert({
        name: 'Season 4',
        ordinal: 4,
        start_date: '2024-09-01',
        end_date: '2024-11-30',
        active: true
      })
      .select()
      .single()

    if (seasonError) {
      console.error('Error creating season:', seasonError)
      return
    }

    console.log('✅ Season created:', season.name)

    // Create teams
    const teams = [
      { name: 'Thunder', slug: 'thunder', color_primary: '#0F4C81', color_secondary: '#1E40AF' },
      { name: 'Lions', slug: 'lions', color_primary: '#B45309', color_secondary: '#D97706' },
      { name: 'Eagles', slug: 'eagles', color_primary: '#16A34A', color_secondary: '#22C55E' },
      { name: 'Warriors', slug: 'warriors', color_primary: '#DC2626', color_secondary: '#EF4444' },
      { name: 'Wolves', slug: 'wolves', color_primary: '#6B7280', color_secondary: '#9CA3AF' },
      { name: 'Hawks', slug: 'hawks', color_primary: '#7C3AED', color_secondary: '#8B5CF6' },
    ]

    console.log('Creating teams...')
    const { data: createdTeams, error: teamsError } = await supabase
      .from('teams')
      .insert(
        teams.map(team => ({
          ...team,
          season_id: season.id
        }))
      )
      .select()

    if (teamsError) {
      console.error('Error creating teams:', teamsError)
      return
    }

    console.log(`✅ Created ${createdTeams.length} teams`)

    // Create sample players
    const players = [
      // Thunder players
      { first_name: 'Ahmad', last_name: 'Johnson', primary_position: 'QB', email: 'ahmad.johnson@example.com', phone: '214-555-0101' },
      { first_name: 'Omar', last_name: 'Wilson', primary_position: 'WR', email: 'omar.wilson@example.com', phone: '214-555-0102' },
      { first_name: 'Hassan', last_name: 'Brown', primary_position: 'RB', email: 'hassan.brown@example.com', phone: '214-555-0103' },
      { first_name: 'Yusuf', last_name: 'Davis', primary_position: 'DB', email: 'yusuf.davis@example.com', phone: '214-555-0104' },
      { first_name: 'Mohammed', last_name: 'Miller', primary_position: 'LB', email: 'mohammed.miller@example.com', phone: '214-555-0105' },
      { first_name: 'Ibrahim', last_name: 'Garcia', primary_position: 'RUSH', email: 'ibrahim.garcia@example.com', phone: '214-555-0106' },
      { first_name: 'Ali', last_name: 'Rodriguez', primary_position: 'WR', email: 'ali.rodriguez@example.com', phone: '214-555-0107' },
      { first_name: 'Khalil', last_name: 'Martinez', primary_position: 'FLEX', email: 'khalil.martinez@example.com', phone: '214-555-0108' },

      // Lions players
      { first_name: 'Amjad', last_name: 'Anderson', primary_position: 'QB', email: 'amjad.anderson@example.com', phone: '214-555-0201' },
      { first_name: 'Tariq', last_name: 'Taylor', primary_position: 'WR', email: 'tariq.taylor@example.com', phone: '214-555-0202' },
      { first_name: 'Samir', last_name: 'Thomas', primary_position: 'RB', email: 'samir.thomas@example.com', phone: '214-555-0203' },
      { first_name: 'Rashid', last_name: 'Jackson', primary_position: 'DB', email: 'rashid.jackson@example.com', phone: '214-555-0204' },
      { first_name: 'Hamza', last_name: 'White', primary_position: 'LB', email: 'hamza.white@example.com', phone: '214-555-0205' },
      { first_name: 'Bilal', last_name: 'Harris', primary_position: 'RUSH', email: 'bilal.harris@example.com', phone: '214-555-0206' },
      { first_name: 'Faisal', last_name: 'Martin', primary_position: 'WR', email: 'faisal.martin@example.com', phone: '214-555-0207' },
      { first_name: 'Waleed', last_name: 'Thompson', primary_position: 'FLEX', email: 'waleed.thompson@example.com', phone: '214-555-0208' },

      // Eagles players  
      { first_name: 'Zaid', last_name: 'Garcia', primary_position: 'QB', email: 'zaid.garcia@example.com', phone: '214-555-0301' },
      { first_name: 'Nasser', last_name: 'Martinez', primary_position: 'WR', email: 'nasser.martinez@example.com', phone: '214-555-0302' },
      { first_name: 'Adnan', last_name: 'Robinson', primary_position: 'RB', email: 'adnan.robinson@example.com', phone: '214-555-0303' },
      { first_name: 'Fahad', last_name: 'Clark', primary_position: 'DB', email: 'fahad.clark@example.com', phone: '214-555-0304' },
      { first_name: 'Majid', last_name: 'Rodriguez', primary_position: 'LB', email: 'majid.rodriguez@example.com', phone: '214-555-0305' },
      { first_name: 'Tamer', last_name: 'Lewis', primary_position: 'RUSH', email: 'tamer.lewis@example.com', phone: '214-555-0306' },
      { first_name: 'Salam', last_name: 'Lee', primary_position: 'WR', email: 'salam.lee@example.com', phone: '214-555-0307' },
      { first_name: 'Kamal', last_name: 'Walker', primary_position: 'FLEX', email: 'kamal.walker@example.com', phone: '214-555-0308' },

      // Warriors players
      { first_name: 'Mustafa', last_name: 'Hall', primary_position: 'QB', email: 'mustafa.hall@example.com', phone: '214-555-0401' },
      { first_name: 'Jamal', last_name: 'Allen', primary_position: 'WR', email: 'jamal.allen@example.com', phone: '214-555-0402' },
      { first_name: 'Saleem', last_name: 'Young', primary_position: 'RB', email: 'saleem.young@example.com', phone: '214-555-0403' },
      { first_name: 'Nasir', last_name: 'Hernandez', primary_position: 'DB', email: 'nasir.hernandez@example.com', phone: '214-555-0404' },
      { first_name: 'Malik', last_name: 'King', primary_position: 'LB', email: 'malik.king@example.com', phone: '214-555-0405' },
      { first_name: 'Saber', last_name: 'Wright', primary_position: 'RUSH', email: 'saber.wright@example.com', phone: '214-555-0406' },
      { first_name: 'Rami', last_name: 'Lopez', primary_position: 'WR', email: 'rami.lopez@example.com', phone: '214-555-0407' },
      { first_name: 'Basel', last_name: 'Hill', primary_position: 'FLEX', email: 'basel.hill@example.com', phone: '214-555-0408' },

      // Wolves players
      { first_name: 'Ahmed', last_name: 'Scott', primary_position: 'QB', email: 'ahmed.scott@example.com', phone: '214-555-0501' },
      { first_name: 'Hasan', last_name: 'Green', primary_position: 'WR', email: 'hasan.green@example.com', phone: '214-555-0502' },
      { first_name: 'Osman', last_name: 'Adams', primary_position: 'RB', email: 'osman.adams@example.com', phone: '214-555-0503' },
      { first_name: 'Imran', last_name: 'Baker', primary_position: 'DB', email: 'imran.baker@example.com', phone: '214-555-0504' },
      { first_name: 'Marwan', last_name: 'Gonzalez', primary_position: 'LB', email: 'marwan.gonzalez@example.com', phone: '214-555-0505' },
      { first_name: 'Nabil', last_name: 'Nelson', primary_position: 'RUSH', email: 'nabil.nelson@example.com', phone: '214-555-0506' },
      { first_name: 'Hakim', last_name: 'Carter', primary_position: 'WR', email: 'hakim.carter@example.com', phone: '214-555-0507' },
      { first_name: 'Saad', last_name: 'Mitchell', primary_position: 'FLEX', email: 'saad.mitchell@example.com', phone: '214-555-0508' },

      // Hawks players
      { first_name: 'Yasir', last_name: 'Perez', primary_position: 'QB', email: 'yasir.perez@example.com', phone: '214-555-0601' },
      { first_name: 'Qasim', last_name: 'Roberts', primary_position: 'WR', email: 'qasim.roberts@example.com', phone: '214-555-0602' },
      { first_name: 'Munir', last_name: 'Turner', primary_position: 'RB', email: 'munir.turner@example.com', phone: '214-555-0603' },
      { first_name: 'Sharif', last_name: 'Phillips', primary_position: 'DB', email: 'sharif.phillips@example.com', phone: '214-555-0604' },
      { first_name: 'Haider', last_name: 'Campbell', primary_position: 'LB', email: 'haider.campbell@example.com', phone: '214-555-0605' },
      { first_name: 'Rafiq', last_name: 'Parker', primary_position: 'RUSH', email: 'rafiq.parker@example.com', phone: '214-555-0606' },
      { first_name: 'Wael', last_name: 'Evans', primary_position: 'WR', email: 'wael.evans@example.com', phone: '214-555-0607' },
      { first_name: 'Louay', last_name: 'Edwards', primary_position: 'FLEX', email: 'louay.edwards@example.com', phone: '214-555-0608' },
    ]

    console.log('Creating players...')
    const { data: createdPlayers, error: playersError } = await supabase
      .from('players')
      .insert(players)
      .select()

    if (playersError) {
      console.error('Error creating players:', playersError)
      return
    }

    console.log(`✅ Created ${createdPlayers.length} players`)

    // Create rosters (assign players to teams)
    const rosters = []
    let playerIndex = 0

    for (const team of createdTeams) {
      const teamPlayers = createdPlayers.slice(playerIndex, playerIndex + 8)
      
      for (let i = 0; i < teamPlayers.length; i++) {
        const player = teamPlayers[i]
        rosters.push({
          season_id: season.id,
          team_id: team.id,
          player_id: player.id,
          jersey_number: i + 1 + (playerIndex % 10),
          role: i === 0 ? 'captain' : i === 1 ? 'co_captain' : 'player'
        })
      }
      
      playerIndex += 8
    }

    console.log('Creating rosters...')
    const { data: createdRosters, error: rostersError } = await supabase
      .from('rosters')
      .insert(rosters)
      .select()

    if (rostersError) {
      console.error('Error creating rosters:', rostersError)
      return
    }

    console.log(`✅ Created ${createdRosters.length} roster entries`)

    // Create sample games for Week 1
    const games = [
      {
        season_id: season.id,
        week: 1,
        kickoff_at: '2024-09-07T14:00:00Z',
        location: 'Norbuck Park Field 1',
        status: 'final',
        home_team_id: createdTeams[0].id, // Thunder
        away_team_id: createdTeams[1].id, // Lions
        home_score: 21,
        away_score: 14
      },
      {
        season_id: season.id,
        week: 1,
        kickoff_at: '2024-09-07T15:30:00Z',
        location: 'Norbuck Park Field 1',
        status: 'final',
        home_team_id: createdTeams[2].id, // Eagles
        away_team_id: createdTeams[3].id, // Warriors
        home_score: 35,
        away_score: 7
      },
      {
        season_id: season.id,
        week: 1,
        kickoff_at: '2024-09-07T17:00:00Z',
        location: 'Norbuck Park Field 1',
        status: 'final',
        home_team_id: createdTeams[4].id, // Wolves
        away_team_id: createdTeams[5].id, // Hawks
        home_score: 28,
        away_score: 10
      },
      // Week 2 games
      {
        season_id: season.id,
        week: 2,
        kickoff_at: '2024-09-14T14:00:00Z',
        location: 'Norbuck Park Field 1',
        status: 'scheduled',
        home_team_id: createdTeams[1].id, // Lions
        away_team_id: createdTeams[2].id, // Eagles
        home_score: 0,
        away_score: 0
      },
      {
        season_id: season.id,
        week: 2,
        kickoff_at: '2024-09-14T15:30:00Z',
        location: 'Norbuck Park Field 1',
        status: 'scheduled',
        home_team_id: createdTeams[3].id, // Warriors
        away_team_id: createdTeams[0].id, // Thunder
        home_score: 0,
        away_score: 0
      },
      {
        season_id: season.id,
        week: 2,
        kickoff_at: '2024-09-14T17:00:00Z',
        location: 'Norbuck Park Field 1',
        status: 'scheduled',
        home_team_id: createdTeams[5].id, // Hawks
        away_team_id: createdTeams[4].id, // Wolves
        home_score: 0,
        away_score: 0
      }
    ]

    console.log('Creating games...')
    const { data: createdGames, error: gamesError } = await supabase
      .from('games')
      .insert(games)
      .select()

    if (gamesError) {
      console.error('Error creating games:', gamesError)
      return
    }

    console.log(`✅ Created ${createdGames.length} games`)

    // Create some sample stats for completed games
    const completedGames = createdGames.filter(g => g.status === 'final')
    
    for (const game of completedGames) {
      console.log(`Creating stats for game ${game.id}...`)
      
      // Get players for both teams
      const homeTeamRoster = createdRosters.filter(r => r.team_id === game.home_team_id).slice(0, 6)
      const awayTeamRoster = createdRosters.filter(r => r.team_id === game.away_team_id).slice(0, 6)

      // Create sample offensive stats
      const offenseStats = []
      
      // Home team offense
      for (let i = 0; i < homeTeamRoster.length; i++) {
        const roster = homeTeamRoster[i]
        const player = createdPlayers.find(p => p.id === roster.player_id)
        
        let stats = { 
          game_id: game.id,
          team_id: roster.team_id,
          player_id: roster.player_id
        }

        // Generate position-based stats
        if (player.primary_position === 'QB') {
          stats = {
            ...stats,
            pass_att: Math.floor(Math.random() * 20) + 10,
            pass_comp: Math.floor(Math.random() * 15) + 8,
            pass_yds: Math.floor(Math.random() * 200) + 150,
            pass_tds: Math.floor(Math.random() * 3) + 1,
            rush_att: Math.floor(Math.random() * 3),
            rush_yds: Math.floor(Math.random() * 20)
          }
        } else if (['WR', 'FLEX'].includes(player.primary_position)) {
          stats = {
            ...stats,
            targets: Math.floor(Math.random() * 8) + 2,
            receptions: Math.floor(Math.random() * 6) + 1,
            rec_yds: Math.floor(Math.random() * 80) + 20,
            rec_tds: Math.random() > 0.6 ? 1 : 0
          }
        } else if (player.primary_position === 'RB') {
          stats = {
            ...stats,
            rush_att: Math.floor(Math.random() * 8) + 3,
            rush_yds: Math.floor(Math.random() * 60) + 20,
            rush_tds: Math.random() > 0.5 ? 1 : 0,
            targets: Math.floor(Math.random() * 3),
            receptions: Math.floor(Math.random() * 2),
            rec_yds: Math.floor(Math.random() * 30)
          }
        }

        offenseStats.push(stats)
      }

      // Away team offense
      for (let i = 0; i < awayTeamRoster.length; i++) {
        const roster = awayTeamRoster[i]
        const player = createdPlayers.find(p => p.id === roster.player_id)
        
        let stats = { 
          game_id: game.id,
          team_id: roster.team_id,
          player_id: roster.player_id
        }

        if (player.primary_position === 'QB') {
          stats = {
            ...stats,
            pass_att: Math.floor(Math.random() * 18) + 8,
            pass_comp: Math.floor(Math.random() * 12) + 5,
            pass_yds: Math.floor(Math.random() * 150) + 100,
            pass_tds: Math.floor(Math.random() * 2),
            rush_att: Math.floor(Math.random() * 3),
            rush_yds: Math.floor(Math.random() * 15)
          }
        } else if (['WR', 'FLEX'].includes(player.primary_position)) {
          stats = {
            ...stats,
            targets: Math.floor(Math.random() * 6) + 1,
            receptions: Math.floor(Math.random() * 4),
            rec_yds: Math.floor(Math.random() * 60) + 10,
            rec_tds: Math.random() > 0.7 ? 1 : 0
          }
        } else if (player.primary_position === 'RB') {
          stats = {
            ...stats,
            rush_att: Math.floor(Math.random() * 6) + 2,
            rush_yds: Math.floor(Math.random() * 40) + 10,
            rush_tds: Math.random() > 0.6 ? 1 : 0,
            targets: Math.floor(Math.random() * 2),
            receptions: Math.floor(Math.random() * 1),
            rec_yds: Math.floor(Math.random() * 20)
          }
        }

        offenseStats.push(stats)
      }

      const { error: offenseError } = await supabase
        .from('player_stats_offense')
        .insert(offenseStats)

      if (offenseError) {
        console.error('Error creating offense stats:', offenseError)
      }

      // Create defensive stats
      const defenseStats = []
      
      const allRosterForGame = [...homeTeamRoster, ...awayTeamRoster]
      
      for (const roster of allRosterForGame) {
        const player = createdPlayers.find(p => p.id === roster.player_id)
        
        if (['DB', 'LB', 'RUSH'].includes(player.primary_position)) {
          const stats = {
            game_id: game.id,
            team_id: roster.team_id,
            player_id: roster.player_id,
            tackles: Math.floor(Math.random() * 8) + 1,
            sacks: Math.random() > 0.8 ? 1 : 0,
            interceptions: Math.random() > 0.9 ? 1 : 0,
            deflections: Math.floor(Math.random() * 3),
            ffumbles: Math.random() > 0.9 ? 1 : 0
          }
          
          defenseStats.push(stats)
        }
      }

      const { error: defenseError } = await supabase
        .from('player_stats_defense')
        .insert(defenseStats)

      if (defenseError) {
        console.error('Error creating defense stats:', defenseError)
      }
    }

    console.log('✅ Created sample player statistics')

    // Refresh materialized views
    console.log('Refreshing materialized views...')
    const { error: refreshError } = await supabase.rpc('refresh_materialized_views')
    
    if (refreshError) {
      console.error('Error refreshing views:', refreshError)
    } else {
      console.log('✅ Materialized views refreshed')
    }

    console.log('')
    console.log('🎉 Database seeded successfully!')
    console.log(`📊 Created: ${createdTeams.length} teams, ${createdPlayers.length} players, ${createdGames.length} games`)
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seed()
}