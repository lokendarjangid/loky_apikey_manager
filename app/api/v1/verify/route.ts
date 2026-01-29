import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyApiKey } from '@/lib/api-key'

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required', valid: false },
        { status: 401 }
      )
    }

    // Extract prefix from the API key
    const parts = apiKey.split('_')
    if (parts.length < 3) {
      return NextResponse.json(
        { error: 'Invalid API key format', valid: false },
        { status: 401 }
      )
    }

    const prefix = `${parts[0]}_${parts[1]}_${parts[2].slice(0, 8)}`

    // Find the key by prefix
    const dbKey = await prisma.apiKey.findUnique({
      where: { prefix },
      include: {
        user: true,
        project: true
      }
    })

    if (!dbKey) {
      return NextResponse.json(
        { error: 'API key not found', valid: false },
        { status: 401 }
      )
    }

    // Check if key is active
    if (dbKey.status !== 'active') {
      return NextResponse.json(
        { error: 'API key is not active', valid: false, status: dbKey.status },
        { status: 401 }
      )
    }

    // Check expiration
    if (dbKey.expiresAt && new Date(dbKey.expiresAt) < new Date()) {
      await prisma.apiKey.update({
        where: { id: dbKey.id },
        data: { status: 'expired' }
      })
      return NextResponse.json(
        { error: 'API key has expired', valid: false },
        { status: 401 }
      )
    }

    // Verify the key hash
    const isValid = await verifyApiKey(apiKey, dbKey.key)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid API key', valid: false },
        { status: 401 }
      )
    }

    // Check rate limit (simplified - in production use Redis)
    const currentHour = new Date().getHours()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const usage = await prisma.usage.findUnique({
      where: {
        apiKeyId_date_hour: {
          apiKeyId: dbKey.id,
          date: today,
          hour: currentHour
        }
      }
    })

    if (usage && usage.requestCount >= dbKey.rateLimit) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          valid: false,
          rateLimit: {
            limit: dbKey.rateLimit,
            remaining: 0,
            reset: new Date(today.getTime() + (currentHour + 1) * 3600000).toISOString()
          }
        },
        { status: 429 }
      )
    }

    // Update usage
    await prisma.usage.upsert({
      where: {
        apiKeyId_date_hour: {
          apiKeyId: dbKey.id,
          date: today,
          hour: currentHour
        }
      },
      update: {
        requestCount: { increment: 1 },
        successCount: { increment: 1 }
      },
      create: {
        apiKeyId: dbKey.id,
        userId: dbKey.userId,
        date: today,
        hour: currentHour,
        requestCount: 1,
        successCount: 1
      }
    })

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: dbKey.id },
      data: { lastUsedAt: new Date() }
    })

    const remaining = usage ? dbKey.rateLimit - usage.requestCount - 1 : dbKey.rateLimit - 1

    return NextResponse.json({
      valid: true,
      keyId: dbKey.id,
      userId: dbKey.userId,
      projectId: dbKey.projectId,
      rateLimit: {
        limit: dbKey.rateLimit,
        remaining,
        reset: new Date(today.getTime() + (currentHour + 1) * 3600000).toISOString()
      }
    })
  } catch (error) {
    console.error('Error verifying API key:', error)
    return NextResponse.json(
      { error: 'Internal server error', valid: false },
      { status: 500 }
    )
  }
}
