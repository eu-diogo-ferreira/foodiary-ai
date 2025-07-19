import { APIGatewayProxyResultV2 } from 'aws-lambda'
import { HttpResponse } from "../types/http"

export function parseResponse(response: HttpResponse): APIGatewayProxyResultV2 {
    return {
        statusCode: response.statusCode,
        body: JSON.stringify(response.body)
   }
}