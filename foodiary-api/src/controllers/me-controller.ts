import {  HttpResponse, ProtectedHttpRequest } from "../types/http";
import { notFound, ok } from "../utils/http";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';

export class MeController {
    static async handle({ context }: ProtectedHttpRequest): Promise<HttpResponse> {
        const user = await db.query.usersTable.findFirst({
            columns: {
                id: true,
                email: true,
                name: true,
                calories: true,
                proteins: true,
                carbohydrates: true,
                fats: true,
            },
            where: eq(usersTable.id, context.userId)
        });
        if (!user) {
            return notFound({ error: 'user not found.' });
        }

        return ok({ user });
    }
}