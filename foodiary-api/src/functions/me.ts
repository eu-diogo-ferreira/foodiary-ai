import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { parseResponse } from '../utils/parseResponse';
import { MeController } from '../controllers/me-controller';
import { parseProtectedEvent } from '../utils/parse-protected-event';
import { unauthorized } from '../utils/http';
import { error } from 'console';

export async function handler(event: APIGatewayProxyEventV2) {
    try {
        const { body, params, queryParams, context } = parseProtectedEvent(event)

        const response = await MeController.handle({
            body,
            params,
            queryParams,
            context
        });

        return parseResponse(response)
    } catch {
        return parseResponse(unauthorized({
            error: 'invalid access.'
        }));
    }
}