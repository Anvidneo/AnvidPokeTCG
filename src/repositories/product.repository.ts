import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
    QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Product, ProductType } from '../models/product.model';
import { NotFoundError } from '../utils/errors';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PRODUCTS_TABLE!;

export async function createProduct(product: Product): Promise<Product> {
    await docClient.send(
        new PutCommand({
        TableName: TABLE_NAME,
        Item: product,
        }),
    );

    return product;
}

export async function getProductById(id: string): Promise<Product> {
    const result = await docClient.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: { id },
        }),
    );

    if (!result.Item) {
        throw new NotFoundError('Product', id);
    }

    return result.Item as Product;
}

export async function listProducts(type?: ProductType): Promise<Product[]> {
    if (type) {
        const result = await docClient.send(
            new QueryCommand({
                TableName: TABLE_NAME,
                IndexName: 'type-createdAt-index',
                KeyConditionExpression: '#type = :type',
                ExpressionAttributeNames: { '#type': 'type' },
                ExpressionAttributeValues: { ':type': type },
            }),
        );

        return (result.Items ?? []) as Product[];
    }

    const result = await docClient.send(
        new ScanCommand({
            TableName: TABLE_NAME,
        }),
    );

    return (result.Items ?? []) as Product[];
}

export async function updateProduct(id: string,fields: Partial<Omit<Product, 'id' | 'createdAt'>>,): Promise<Product> {
    await getProductById(id);

    const entries = Object.entries(fields);

    const updateExpression = 'SET ' + entries.map((_, i) => `#field${i} = :val${i}`).join(', ');

    const expressionAttributeNames = Object.fromEntries(
        entries.map(([key], i) => [`#field${i}`, key]),
    );

    const expressionAttributeValues = Object.fromEntries(
        entries.map(([, value], i) => [`:val${i}`, value]),
    );

    const result = await docClient.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        }),
    );

    return result.Attributes as Product;
}

export async function deleteProduct(id: string): Promise<void> {
    await getProductById(id);

    await docClient.send(
        new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id },
        }),
    );
}