import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth/auth';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const { categoryId, responses } = await request.json();

    // Validate input
    if (!categoryId || !responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Create a session ID for anonymous users or get user ID for authenticated users
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : nanoid();

    // Start a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Save each response
      for (const response of responses) {
        const { questionId, rating } = response;

        if (!questionId || typeof rating !== 'number') {
          throw new Error('Invalid response data');
        }

        await tx.response.create({
          data: {
            rating,
            questionId,
            userId: userId || 'anonymous',
            sessionId: sessionId,
          },
        });
      }

      // Calculate the average score for this category
      const averageScore = responses.reduce((sum, response) => sum + response.rating, 0) / responses.length;

      // Map the average to a 0-100 scale (from -3 to 3 rating scale)
      const normalizedScore = ((averageScore + 3) / 6) * 100;

      // Save the quiz result
      const quizResult = await tx.quizResult.create({
        data: {
          score: normalizedScore,
          categoryId,
          userId: userId || 'anonymous',
          sessionId: sessionId,
        },
      });

      return { quizResult };
    });

    return NextResponse.json({
      success: true,
      resultId: result.quizResult.id,
      sessionId: sessionId,
    });
  } catch (error) {
    console.error('Error submitting quiz responses:', error);
    return NextResponse.json({ error: 'Failed to submit quiz responses' }, { status: 500 });
  }
}
