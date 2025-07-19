import z from 'zod';
import { badRequest } from "../utils/http";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { mealsTable } from '../db/schema';

const schema = z.object({
    fileKey: z.string(),
});

export class ProcessMealController {
    static async process({ body }: Record<any, any>) {
        const { success, data, error } = schema.safeParse(body);

        if (!success) {
            return badRequest({ error })
        }

        const meal = await db.query.mealsTable.findFirst({
            where: eq(mealsTable.inputFileKey, data.fileKey)
        });

        if (!meal) {
            throw new Error('meal not found to process.')
        }

        if (meal.status === 'failed' || meal.status === 'success') {
            // aws should remove from queue
            return;
        }

        await db.update(mealsTable).set({
            status: 'processing'
        }).where(eq(mealsTable.id, meal.id));

        try {
            // TODO: call ai
            await db.update(mealsTable).set({
                status: 'success',
                name: 'Café da manhã',
                icon: '🍞',
                foods: [
                    {
                    name: 'Pão',
                    quantity: '2 fatias',
                    calories: 100,
                    proteins: 200,
                    carbohydrates: 300,
                    fasts: 400,
                    },
                ],
            }).where(eq(mealsTable.id, meal.id));
        } catch (error) {
            await db.update(mealsTable).set({
                status: 'failed'
            }).where(eq(mealsTable.id, meal.id));
        }
        
    }
}