import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import z from 'zod';
import {  HttpResponse, ProtectedHttpRequest } from "../types/http";
import { badRequest, created, notFound, ok } from "../utils/http";
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { mealsTable, usersTable } from '../db/schema';
import { randomUUID } from 'crypto';
import { s3Client } from '../clients/s3-client';

const schema = z.object({
    fileType: z.enum(['audio/m4a', 'image/jpeg']),
});

export class CreateMealController {
    static async handle({ body, context }: ProtectedHttpRequest): Promise<HttpResponse> {
        const { success, data, error } = schema.safeParse(body);

        if (!success) {
            return badRequest({ error })
        }

        const fileId = randomUUID();
        const extension = data.fileType === 'audio/m4a' ? '.m4a' : '.jpg';
        const fileKey = `${fileId}${extension}`;

        console.log("@@@ process.env.BUCKET_NAME", process.env.BUCKET_NAME)

        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: fileKey
        });

        // 1 minute to upload file, after pre-sign
        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 600
        });

        const [meal] = await db.insert(mealsTable).values({
            userId: context.userId,
            inputFileKey: fileKey,
            inputType: data.fileType === 'audio/m4a' ? 'audio' : 'picture',
            status: 'uploading',
            icon: '',
            name: '',
            foods: []
        })
        .returning({ id: mealsTable.id });

        return created({
            mealId: meal.id,
            presignedUrl
        });
    }
}