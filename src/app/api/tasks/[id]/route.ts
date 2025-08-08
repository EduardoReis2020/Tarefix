import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const taskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    const taskId = params.id;
    const body = await request.json();
    const data = taskUpdateSchema.parse(body);

    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== user.id) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: data,
    });

    return NextResponse.json(updatedTask);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    const taskId = params.id;

    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== user.id) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    await prisma.task.delete({ where: { id: taskId } });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
