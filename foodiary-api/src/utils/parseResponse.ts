import { HttpResponse } from "../types/http"

export function parseResponse(response: HttpResponse) {
    return {
        statusCode: response.statusCode,
        body: JSON.stringify(response.body)
   }
}