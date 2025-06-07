import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const resultId = params.id;

    if (!resultId) {
      return NextResponse.json({ error: 'Result ID is required' }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'es';
    const sessionId = searchParams.get('sessionId');

    // Find the result
    const result = await prisma.quizResult.findUnique({
      where: {
        id: resultId,
      },
      include: {
        category: {
          where: {
            language: language as string,
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    // Check if the user has access to this result
    if (result.userId !== 'anonymous' && result.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // For anonymous users, check session ID
    if (result.userId === 'anonymous' && result.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the detailed responses for this result
    const responses = await prisma.response.findMany({
      where: {
        userId: result.userId,
        sessionId: result.sessionId,
        createdAt: {
          gte: new Date(result.createdAt.getTime() - 5 * 60 * 1000), // 5 minutes before result
          lte: result.createdAt,
        },
      },
      include: {
        question: {
          where: {
            language: language as string,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({
      result,
      responses,
    });
  } catch (error) {
    console.error('Error fetching result details:', error);
    return NextResponse.json({ error: 'Failed to fetch result details' }, { status: 500 });
  }
}
