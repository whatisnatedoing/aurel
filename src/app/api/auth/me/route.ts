import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { Users } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null })
  const user = Users.findById(session.userId)
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
}
