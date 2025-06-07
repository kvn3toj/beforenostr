import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'es';

    // Get all quiz results for the user
    const results = await prisma.quizResult.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        category: {
          where: {
            language: language as string,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching user results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
