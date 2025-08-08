import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'OVERDUE']).optional(),
});

export async function GET() {
  const { userId: clerkUserId } = await auth();
  
  if (!clerkUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Buscar usuário no banco pelo clerkId
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { dueDate: 'asc' },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const { userId: clerkUserId } = await auth();
  
  if (!clerkUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Buscar usuário no banco pelo clerkId
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const data = taskSchema.parse(body);

    const newTask = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority ?? 'MEDIUM',
        status: data.status ?? 'PENDING',
        userId: user.id,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
