import { HttpResponse } from "../types/http";

export function ok(body?: Record<string, any>): HttpResponse {
    return {
        statusCode: 200,
        body: body ?? {}
    }
}

export function created(body?: Record<string, any>): HttpResponse {
    return {
        statusCode: 201,
        body: body ?? {}
    }
}

export function internalError(body?: Record<string, any>): HttpResponse {
    return {
        statusCode: 500,
        body: body ?? {}
    }
}
