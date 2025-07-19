import z from 'zod';
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, ok, unauthorized } from "../utils/http";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';
import { signAccessTokenFor } from '../libs/jwt';

const schema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export class SignInController {
    static async handle({ body }: HttpRequest): Promise<HttpResponse> {
        const { success, data, error } = schema.safeParse(body);

        if (!success) {
            return badRequest({ error })
        }

        const user = await db.query.usersTable.findFirst({
            columns: {
                id: true,
                email: true,
                password: true
            },
            where: eq(usersTable.email, data.email)
        });
        if (!user) {
            return unauthorized({ error: 'invalid credentials.' });
        }

        const isPasswordValid = await compare(data.password, user.password);
        if (!isPasswordValid) {
            return unauthorized({ error: 'invalid credentials.' });
        }

        const accessToken = signAccessTokenFor(user.id);

        return ok({ accessToken });
    }
}