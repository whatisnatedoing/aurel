import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { Designs } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const designs = Designs.findByUser(session.userId)
  return NextResponse.json({ designs })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, config } = await req.json()
  if (!name || !config)
    return NextResponse.json({ error: 'Name and config required' }, { status: 400 })
  const design = Designs.create({ userId: session.userId, name, config })
  return NextResponse.json({ design })
}
