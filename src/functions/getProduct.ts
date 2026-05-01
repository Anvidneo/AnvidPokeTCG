import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getOne } from '../controllers/product.controller';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    return getOne(event);
}