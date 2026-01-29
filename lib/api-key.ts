import { customAlphabet } from 'nanoid'
import * as bcrypt from 'bcryptjs'

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 32)

export async function generateApiKey(): Promise<{ key: string; prefix: string; hash: string }> {
  // Generate a unique API key
  const randomPart = nanoid()
  const prefix = `sk_${process.env.NODE_ENV === 'production' ? 'live' : 'test'}_${randomPart.slice(0, 8)}`
  const key = `${prefix}_${randomPart.slice(8)}`
  
  // Hash the key for storage
  const hash = await bcrypt.hash(key, 10)
  
  return { key, prefix, hash }
}

export async function verifyApiKey(providedKey: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(providedKey, storedHash)
}

export function maskApiKey(key: string): string {
  const parts = key.split('_')
  if (parts.length < 3) return '***'
  return `${parts[0]}_${parts[1]}_${parts[2].slice(0, 4)}...${parts[2].slice(-4)}`
}
