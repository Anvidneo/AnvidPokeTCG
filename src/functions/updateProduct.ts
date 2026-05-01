import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { update } from '../controllers/product.controller';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    return update(event);
}