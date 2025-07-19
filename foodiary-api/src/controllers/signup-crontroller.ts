import z from 'zod';
import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, conflict, created } from "../utils/http";
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs'
import { signAccessTokenFor } from '../libs/jwt';
import { calculateGoals } from '../libs/calculators';

const schema = z.object({
    goal: z.enum(['lose', 'maintain', 'gain']),
    gender: z.enum(['male', 'female']),
    birthDate: z.iso.date(),
    height: z.number(),
    weight: z.number(),
    activityLevel: z.number().min(1).max(5),
    account: z.object({
        name: z.string().min(1),
        email: z.email(),
        password: z.string().min(8),
    }),
})

export class SignUpController {
    static async handle({ body }: HttpRequest): Promise<HttpResponse> {
        const { success, data, error } = schema.safeParse(body);

        if (!success) {
            return badRequest({ error })
        }

        const userAlreadyExists = await db.query.usersTable.findFirst({
            columns: {
                email: true
            },
            where: eq(usersTable.email, data.account.email)
        });

        if (userAlreadyExists) {
            return conflict({ error: 'this email is already in use.' })
        }

        const { account, ...rest } = data;
        const goals = calculateGoals({
            activityLevel: rest.activityLevel,
            birthDate: new Date(rest.birthDate),
            gender: rest.gender,
            goal: rest.goal,
            height: rest.height,
            weight: rest.weight,
        });

        const hashedPassword = await hash(account.password, 8);

        const [user] = await db.insert(usersTable).values({
            ...account, 
            ...rest,
            ...goals,
            password: hashedPassword,
        }).returning({
            id: usersTable.id
        });

        const accessToken = signAccessTokenFor(user.id);

        return created({ accessToken });
    }
}