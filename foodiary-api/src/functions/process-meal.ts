import { SQSEvent } from 'aws-lambda'
import { ProcessMealController } from '../controllers/process-meal-controller';

export async function handler(event: SQSEvent) {
    await Promise.all(
        event.Records.map(async record => {
            const body = JSON.parse(record.body);
            await ProcessMealController.process({ body });
        })
    )
}