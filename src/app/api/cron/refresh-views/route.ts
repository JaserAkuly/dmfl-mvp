import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    
    // Refresh materialized views
    const { error } = await supabase.rpc('refresh_materialized_views')
    
    if (error) {
      console.error('Error refreshing views:', error)
      return NextResponse.json({ error: 'Failed to refresh views' }, { status: 500 })
    }

    console.log('Materialized views refreshed successfully')
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() })
    
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}