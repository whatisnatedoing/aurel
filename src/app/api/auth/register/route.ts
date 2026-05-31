import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Users } from '@/lib/db'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()
  if (!name || !email || !password)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  if (Users.findByEmail(email))
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  const passwordHash = await bcrypt.hash(password, 12)
  const user = Users.create({ name, email: email.toLowerCase(), passwordHash })
  const token = await signToken({ userId: user.id, email: user.email })
  setSessionCookie(token)
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
}
