import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('seasonId')

    if (!seasonId) {
      return NextResponse.json({ error: 'Season ID required' }, { status: 400 })
    }

    const supabase = createClient()

    // Get league overview data
    const [
      { data: standings },
      { data: leaderboards },
      { data: games }
    ] = await Promise.all([
      supabase.from('v_team_standings').select('*').eq('season_id', seasonId),
      supabase.from('v_leaderboards').select('*').eq('season_id', seasonId).limit(20),
      supabase.from('games').select('*').eq('season_id', seasonId).eq('status', 'final')
    ])

    // Create summary for AI analysis
    const leagueData = {
      totalTeams: standings?.length || 0,
      totalGames: games?.length || 0,
      topTeam: standings?.[0],
      topScorer: leaderboards?.find(l => l.category === 'total_tds'),
      topPasser: leaderboards?.find(l => l.category === 'pass_yds'),
      topRusher: leaderboards?.find(l => l.category === 'rush_yds'),
      topReceiver: leaderboards?.find(l => l.category === 'rec_yds'),
      topDefender: leaderboards?.find(l => l.category === 'interceptions'),
      averageScore: games?.length ? 
        (games.reduce((sum, g) => sum + (g.home_score + g.away_score), 0) / games.length).toFixed(1) : 0
    }

    const prompt = `Generate 3-4 interesting insights about this flag football league season:

League Data:
- ${leagueData.totalTeams} teams, ${leagueData.totalGames} games completed
- Average game score: ${leagueData.averageScore} points
- Leading team: ${leagueData.topTeam?.team_name} (${leagueData.topTeam?.wins}-${leagueData.topTeam?.losses})
- Top scorer: ${leagueData.topScorer?.first_name} ${leagueData.topScorer?.last_name} (${leagueData.topScorer?.stat_value} TDs)
- Passing leader: ${leagueData.topPasser?.first_name} ${leagueData.topPasser?.last_name} (${leagueData.topPasser?.stat_value} yards)

Provide insights as a JSON array of objects with 'title' and 'description' fields. Focus on trends, standout performances, and competitive balance.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a sports analyst. Generate engaging insights about flag football league performance. Return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 600,
      temperature: 0.8
    })

    let insights
    try {
      insights = JSON.parse(completion.choices[0]?.message?.content || '[]')
    } catch {
      // Fallback if JSON parsing fails
      insights = [
        {
          title: "Season Overview",
          description: `The league is seeing competitive play across ${leagueData.totalTeams} teams with ${leagueData.totalGames} games completed.`
        }
      ]
    }

    return NextResponse.json({
      insights,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}