import z from "zod";
import { badRequest } from "../utils/http";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { mealsTable } from "../db/schema";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../clients/s3-client";
import { Readable } from "stream";
import { getMealDetailsFromText, transcribeAudio } from "../services/ai";

const schema = z.object({
  fileKey: z.string(),
});

export class ProcessMealController {
  static async process({ body }: Record<any, any>) {
    const { success, data, error } = schema.safeParse(body);

    if (!success) {
      return badRequest({ error });
    }

    const meal = await db.query.mealsTable.findFirst({
      where: eq(mealsTable.inputFileKey, data.fileKey),
    });

    if (!meal) {
      throw new Error('Meal not found.');
    }

    if (meal.status === 'failed' || meal.status === 'success') {
      return;
    }

    await db
      .update(mealsTable)
      .set({ status: 'processing' })
      .where(eq(mealsTable.id, meal.id));

    try {
      let icon = '';
      let name = '';
      let foods = [];

      if (meal.inputType === 'audio') {
        const audioFileBuffer = await this.downloadAudioFile(meal.inputFileKey);
        const transcription = await transcribeAudio(audioFileBuffer);

        const mealDetails = await getMealDetailsFromText({
          createdAt: new Date(),
          text: transcription,
        });

        icon = mealDetails.icon;
        name = mealDetails.name;
        foods = mealDetails.foods;
      }

      await db
        .update(mealsTable)
        .set({
          status: 'success',
          name,
          icon,
          foods,
        })
        .where(eq(mealsTable.id, meal.id));
    } catch (error) {
      console.log(error);

      await db
        .update(mealsTable)
        .set({ status: 'failed' })
        .where(eq(mealsTable.id, meal.id));
    }
  }

  private static async downloadAudioFile(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    const { Body } = await s3Client.send(command);

    if (!Body || !(Body instanceof Readable)) {
      throw new Error('Cannot load the audio file.');
    }

    const chunks = [];
    for await (const chunk of Body) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}
