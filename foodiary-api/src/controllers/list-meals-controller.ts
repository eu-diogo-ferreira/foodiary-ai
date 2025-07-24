import z from 'zod';
import {  HttpResponse, ProtectedHttpRequest } from "../types/http";
import { badRequest, ok } from "../utils/http";
import { db } from '../db';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { mealsTable } from '../db/schema';

const schema = z.object({
    date: z.iso.date().transform(str => new Date(str))
});

export class ListMealsController {
    static async handle({ context, queryParams }: ProtectedHttpRequest): Promise<HttpResponse> {
        const { success, data, error } = schema.safeParse(queryParams);

        if (!success) {
            return badRequest({ error })
        }

        const endDate = new Date(data.date);
        endDate.setUTCHours(23, 59, 59, 59);

        const meals = await db.query.mealsTable.findMany({
            columns: {
                id: true,
                foods: true,
                createdAt: true,
                icon: true,
                name: true
            },
            where: and(
                eq(mealsTable.userId, context.userId),
                eq(mealsTable.status, 'success'),
                gte(mealsTable.createdAt, data.date),
                lte(mealsTable.createdAt, endDate)
            ),
            orderBy: [desc(mealsTable.createdAt)]
        });

        return ok({ meals });
    }
}