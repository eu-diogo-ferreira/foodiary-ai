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

export function badRequest(body?: Record<string, any>): HttpResponse {
    return {
        statusCode: 400,
        body: body ?? {}
    }
}

export function unauthorized(body?: Record<string, any>): HttpResponse {
    return {
        statusCode: 401,
        body: body ?? {}
    }
}

export function notFound(body?: Record<string, any>): HttpResponse {
    return {
        statusCode: 404,
        body: body ?? {}
    }
}

export function conflict(body?: Record<string, any>): HttpResponse {
    return {
        statusCode: 409,
        body: body ?? {}
    }
}

export function internalError(body?: Record<string, any>): HttpResponse {
    return {
        statusCode: 500,
        body: body ?? {}
    }
}
