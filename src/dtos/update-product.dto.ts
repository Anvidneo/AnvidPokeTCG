import { z } from 'zod';

export const UpdateProductSchema = z.object({
    name: z.string().min(1, 'name must be a non-empty string').optional(),
    type: z.enum(['sealed', 'single'], {
        error: 'type must be sealed or single',
    }).optional(),
    set: z.string().min(1, 'set must be a non-empty string').optional(),
    condition: z.enum(['NM', 'LP', 'MP', 'HP', 'DMG'], {
        error: 'condition must be one of: NM, LP, MP, HP, DMG',
    }).optional(),
    language: z.enum(['EN', 'JP', 'ES', 'DE', 'FR', 'IT', 'PT', 'KO', 'ZH'], {
        error: 'language must be one of: EN, JP, ES, DE, FR, IT, PT, KO, ZH',
    }).optional(),
    quantity: z.number().int().min(1, 'quantity must be at least 1').optional(),
    price: z.number().min(0, 'price must be a non-negative number').optional(),
    currency: z.string().min(1, 'currency is required').toUpperCase().optional(),
    notes: z.string().optional(),
})
.refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
});

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;