import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { ProtectedHttpRequest } from '../types/http';
import { parseEvent } from './parseEvent';
import { validateAccessToken } from '../libs/jwt';

export function parseProtectedEvent(event: APIGatewayProxyEventV2): ProtectedHttpRequest {
    const baseEvent = parseEvent(event);
    const { authorization } = event.headers;

    if (!authorization) {
        throw new Error('Access token not provided.');
    }
    
    const [, token] = authorization.split(' ');
    const userId = validateAccessToken(token);

    if (!userId) {
        throw new Error('Invalid access token.');
    }

    return {
        ...baseEvent,
        context: { userId }
    }
}