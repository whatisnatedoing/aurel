// Lightweight file-based "database" using JSON files in /tmp
// In production, replace with PostgreSQL / Supabase / PlanetScale
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DB_DIR = path.join(process.cwd(), '.aurel-db')
if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true })

function readTable<T>(name: string): T[] {
  const file = path.join(DB_DIR, `${name}.json`)
  if (!existsSync(file)) return []
  return JSON.parse(readFileSync(file, 'utf-8'))
}

function writeTable<T>(name: string, data: T[]) {
  writeFileSync(path.join(DB_DIR, `${name}.json`), JSON.stringify(data, null, 2))
}

// ─── Users ────────────────────────────────────────────────────────────────────
export interface DBUser {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
}

export const Users = {
  findByEmail: (email: string) =>
    readTable<DBUser>('users').find(u => u.email === email.toLowerCase()),
  findById: (id: string) =>
    readTable<DBUser>('users').find(u => u.id === id),
  create: (data: Omit<DBUser, 'id' | 'createdAt'>): DBUser => {
    const users = readTable<DBUser>('users')
    const user: DBUser = { id: uuidv4(), createdAt: new Date().toISOString(), ...data }
    writeTable('users', [...users, user])
    return user
  },
}

// ─── Designs ─────────────────────────────────────────────────────────────────
export interface DBDesign {
  id: string
  userId: string
  name: string
  config: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export const Designs = {
  findByUser: (userId: string) =>
    readTable<DBDesign>('designs')
      .filter(d => d.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  findById: (id: string) =>
    readTable<DBDesign>('designs').find(d => d.id === id),
  create: (data: Omit<DBDesign, 'id' | 'createdAt' | 'updatedAt'>): DBDesign => {
    const designs = readTable<DBDesign>('designs')
    const now = new Date().toISOString()
    const design: DBDesign = { id: uuidv4(), createdAt: now, updatedAt: now, ...data }
    writeTable('designs', [...designs, design])
    return design
  },
  update: (id: string, data: Partial<DBDesign>): DBDesign | null => {
    const designs = readTable<DBDesign>('designs')
    const idx = designs.findIndex(d => d.id === id)
    if (idx === -1) return null
    designs[idx] = { ...designs[idx], ...data, updatedAt: new Date().toISOString() }
    writeTable('designs', designs)
    return designs[idx]
  },
  delete: (id: string) => {
    const designs = readTable<DBDesign>('designs').filter(d => d.id !== id)
    writeTable('designs', designs)
  },
}
