import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { Designs } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const design = Designs.findById(params.id)
  if (!design || design.userId !== session.userId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { name, config } = await req.json()
  const updated = Designs.update(params.id, { name, config })
  return NextResponse.json({ design: updated })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const design = Designs.findById(params.id)
  if (!design || design.userId !== session.userId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  Designs.delete(params.id)
  return NextResponse.json({ ok: true })
}
