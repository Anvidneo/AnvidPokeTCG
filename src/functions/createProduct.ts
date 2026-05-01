import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { create } from '../controllers/product.controller';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    return create(event);
}