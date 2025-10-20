import prisma from "../../../lib/prisma";

export async function createUser(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}

export async function findUserById(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function updateUser(userId: string, data: { name?: string; password?: string }) {
    return prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function deleteUser(userId: string) {
    return prisma.user.delete({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}
