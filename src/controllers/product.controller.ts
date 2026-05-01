import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';
import { CreateProductSchema } from '../dtos/create-product.dto';
import { UpdateProductSchema } from '../dtos/update-product.dto';
import { ProductType } from '../models/product.model';
import * as productService from '../services/product.service';
import { isAppError } from '../utils/errors';
import { ok, created, noContent, badRequest, notFound, internalError } from '../utils/response';

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const body = JSON.parse(event.body ?? '{}');
        const dto = CreateProductSchema.parse(body);
        const product = await productService.createProduct(dto);
        return created(product);
    } catch (error) {
        if (error instanceof ZodError) {
            return badRequest(error.issues.map((i) => i.message).join(', '));
        }
        if (isAppError(error)) return badRequest(error.message);
        return internalError();
    }
}

export async function getOne(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const { id } = event.pathParameters ?? {};
        if (!id) return badRequest('id is required');

        const product = await productService.getProductById(id);
        return ok(product);
    } catch (error) {
        if (isAppError(error)) return notFound(error.message);
        return internalError();
    }
}

export async function list(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const type = event.queryStringParameters?.type as ProductType | undefined;

        if (type && !['sealed', 'single'].includes(type)) {
            return badRequest('type must be sealed or single');
        }

        const products = await productService.listProducts(type);
        return ok(products);
    } catch (error) {
        if (isAppError(error)) return badRequest(error.message);
        return internalError();
    }
}

export async function update(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const { id } = event.pathParameters ?? {};
        if (!id) return badRequest('id is required');

        const body = JSON.parse(event.body ?? '{}');
        const dto = UpdateProductSchema.parse(body);
        const product = await productService.updateProduct(id, dto);
        return ok(product);
    } catch (error) {
        if (error instanceof ZodError) {
            return badRequest(error.issues.map((i) => i.message).join(', '));
        }
        if (isAppError(error)) return notFound(error.message);
        return internalError();
    }
}

export async function remove(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const { id } = event.pathParameters ?? {};
        if (!id) return badRequest('id is required');

        await productService.deleteProduct(id);
        return noContent();
    } catch (error) {
        if (isAppError(error)) return notFound(error.message);
        return internalError();
    }
}