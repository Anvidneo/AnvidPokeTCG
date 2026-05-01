import { APIGatewayProxyResult } from 'aws-lambda';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

export function ok(data: unknown): APIGatewayProxyResult {
    return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify(data),
    };
}

export function created(data: unknown): APIGatewayProxyResult {
    return {
        statusCode: 201,
        headers: defaultHeaders,
        body: JSON.stringify(data),
    };
}

export function noContent(): APIGatewayProxyResult {
    return {
        statusCode: 204,
        headers: defaultHeaders,
        body: '',
    };
}

export function badRequest(message: string): APIGatewayProxyResult {
    return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({ error: message }),
    };
}

export function notFound(message: string): APIGatewayProxyResult {
    return {
        statusCode: 404,
        headers: defaultHeaders,
        body: JSON.stringify({ error: message }),
    };
}

export function internalError(message = 'Internal server error'): APIGatewayProxyResult {
    return {
        statusCode: 500,
        headers: defaultHeaders,
        body: JSON.stringify({ error: message }),
    };
}