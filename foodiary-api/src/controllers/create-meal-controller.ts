import z from 'zod';
import {  HttpResponse, ProtectedHttpRequest } from "../types/http";
import { badRequest, created, notFound, ok } from "../utils/http";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { mealsTable, usersTable } from '../db/schema';

const schema = z.object({
    fileType: z.enum(['audio/m4a', 'image/jpeg']),
});

export class CreateMealController {
    static async handle({ body, context }: ProtectedHttpRequest): Promise<HttpResponse> {
        const { success, data, error } = schema.safeParse(body);

        if (!success) {
            return badRequest({ error })
        }

        const meal = await db.insert(mealsTable).values({
            userId: context.userId,
            inputFileKey: 'input_file_key',
            inputType: data.fileType === 'audio/m4a' ? 'audio' : 'picture',
            status: 'uploading',
            icon: '',
            name: '',
            foods: []
        });

        return created({});
    }
}