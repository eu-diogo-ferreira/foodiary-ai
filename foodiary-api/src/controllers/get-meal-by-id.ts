import z from 'zod';
import { endOfDay } from 'date-fns';
import {  HttpResponse, ProtectedHttpRequest } from "../types/http";
import { badRequest, notFound, ok } from "../utils/http";
import { db } from '../db';
import { and, eq } from 'drizzle-orm';
import { mealsTable } from '../db/schema';

const schema = z.object({
    mealId: z.uuid()
});

export class GetMealByIdController {
    static async handle({ context, params }: ProtectedHttpRequest): Promise<HttpResponse> {
        const { success, data, error } = schema.safeParse(params);

        if (!success) {
            return badRequest({ error })
        }

        const meal = await db.query.mealsTable.findFirst({
            columns: {
                id: true,
                foods: true,
                createdAt: true,
                icon: true,
                name: true,
                status: true,
            },
            where: and(
                eq(mealsTable.userId, context.userId),
                eq(mealsTable.id, data.mealId)
            )
        });

        if (!meal) {
            return notFound()
        }

        return ok({ meal });
    }
}