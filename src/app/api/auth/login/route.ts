import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Users } from '@/lib/db'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password)
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  const user = Users.findByEmail(email)
  if (!user)
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid)
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  const token = await signToken({ userId: user.id, email: user.email })
  setSessionCookie(token)
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
}
