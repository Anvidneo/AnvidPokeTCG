import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { list } from '../controllers/product.controller';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    return list(event);
}