import z from 'zod';
import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, ok } from "../utils/http";

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

        return ok({ message: 'ok', data })
    }
}