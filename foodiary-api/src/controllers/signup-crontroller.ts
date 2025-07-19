import z from 'zod';
import { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, created } from "../utils/http";

const schema = z.object({
    goal: z.enum(['lose', 'maintain', 'gain']),
    gender: z.enum(['male', 'female']),
    birthDate: z.iso.date(),
    heigth: z.number(),
    weigth: z.number(),
    activityNumber: z.number().min(1).max(5),
    account: z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(8)
    })
})

export class SignUpController {
    static async handle({ body }: HttpRequest): Promise<HttpResponse> {
        const { success, data, error } = schema.safeParse(body);

        if (!success) {
            return badRequest({ error })
        }

        return created({ message: 'ok', data })
    }
}