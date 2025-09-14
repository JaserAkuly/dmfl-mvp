import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const AnalyzeRequestSchema = z.object({
  type: z.enum(['player_performance', 'team_analysis', 'game_prediction', 'injury_risk']),
  playerId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  gameId: z.string().uuid().optional(),
  seasonId: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, playerId, teamId, gameId, seasonId } = AnalyzeRequestSchema.parse(body)

    const supabase = createClient()
    let analysisData = {}
    let prompt = ''

    switch (type) {
      case 'player_performance':
        if (!playerId) {
          return NextResponse.json({ error: 'Player ID required' }, { status: 400 })
        }
        
        // Fetch player data
        const { data: playerStats } = await supabase
          .from('v_player_season_offense')
          .select('*')
          .eq('player_id', playerId)
          
        const { data: playerDefense } = await supabase
          .from('v_player_season_defense')
          .select('*')
          .eq('player_id', playerId)

        analysisData = { offense: playerStats, defense: playerDefense }
        prompt = `Analyze this flag football player's performance data and provide insights on:
        1. Strengths and weaknesses
        2. Performance trends
        3. Areas for improvement
        4. Comparison to position averages
        
        Data: ${JSON.stringify(analysisData)}`
        break

      case 'team_analysis':
        if (!teamId) {
          return NextResponse.json({ error: 'Team ID required' }, { status: 400 })
        }
        
        const { data: teamStandings } = await supabase
          .from('v_team_standings')
          .select('*')
          .eq('team_id', teamId)
          .single()

        const { data: teamGames } = await supabase
          .from('games')
          .select(`
            *,
            home_team:teams!home_team_id(name),
            away_team:teams!away_team_id(name)
          `)
          .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
          .eq('status', 'final')

        analysisData = { standings: teamStandings, games: teamGames }
        prompt = `Analyze this flag football team's performance and provide:
        1. Overall team assessment
        2. Offensive and defensive strengths
        3. Win/loss patterns and trends
        4. Key player contributions
        5. Strategic recommendations
        
        Data: ${JSON.stringify(analysisData)}`
        break

      case 'game_prediction':
        if (!gameId) {
          return NextResponse.json({ error: 'Game ID required' }, { status: 400 })
        }
        
        // This would fetch team stats, head-to-head records, etc.
        prompt = 'Predict game outcome based on team performance data'
        break

      case 'injury_risk':
        if (!playerId) {
          return NextResponse.json({ error: 'Player ID required' }, { status: 400 })
        }
        
        // This would analyze player usage patterns
        prompt = 'Assess injury risk based on usage patterns'
        break
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a flag football analytics expert. Provide detailed, actionable insights based on the data provided. Keep your analysis focused and practical for coaches and players.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })

    const analysis = completion.choices[0]?.message?.content

    if (!analysis) {
      return NextResponse.json({ error: 'No analysis generated' }, { status: 500 })
    }

    return NextResponse.json({
      type,
      analysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI analysis error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}