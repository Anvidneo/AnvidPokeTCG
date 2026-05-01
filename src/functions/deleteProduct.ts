import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { remove } from '../controllers/product.controller';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    return remove(event);
}