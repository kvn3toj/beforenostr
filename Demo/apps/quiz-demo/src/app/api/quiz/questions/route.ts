import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const language = searchParams.get('language') || 'es';

    // Validate input
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Get questions for the specified category and language
    const questions = await prisma.question.findMany({
      where: {
        categoryId: categoryId as string,
        language: language as string,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
