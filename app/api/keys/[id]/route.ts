import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find the API key
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id
      }
    })

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    // Revoke the key (soft delete by changing status)
    await prisma.apiKey.update({
      where: { id: params.id },
      data: { status: 'revoked' }
    })

    return NextResponse.json({ message: 'API key revoked successfully' })
  } catch (error) {
    console.error('Error revoking API key:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id
      },
      include: {
        project: true,
        usage: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    })

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    return NextResponse.json({ apiKey })
  } catch (error) {
    console.error('Error fetching API key:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
