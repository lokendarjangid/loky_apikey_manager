import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateApiKey } from '@/lib/api-key'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const keys = await prisma.apiKey.findMany({
      where: { userId: dbUser.id },
      include: {
        project: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ keys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, projectId, rateLimit, expiresAt } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check user's plan limits
    if (dbUser.plan === 'free') {
      const existingKeys = await prisma.apiKey.count({
        where: { userId: dbUser.id, status: 'active' }
      })

      if (existingKeys >= 5) {
        return NextResponse.json(
          { error: 'Free plan limited to 5 API keys. Upgrade to create more.' },
          { status: 403 }
        )
      }
    }

    // Generate API key
    const { key, prefix, hash } = await generateApiKey()

    // Create API key in database
    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: hash,
        prefix,
        userId: dbUser.id,
        projectId: projectId || undefined,
        rateLimit: rateLimit || 1000,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      }
    })

    // Return the plain key ONLY on creation (won't be shown again)
    return NextResponse.json({ 
      apiKey: {
        ...apiKey,
        key // Return the plain key only once
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
