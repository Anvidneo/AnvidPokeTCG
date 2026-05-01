import { z } from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(1, 'name is required'),
    type: z.enum(['sealed', 'single'], {
        error: 'type must be sealed or single',
    }),
    set: z.string().min(1, 'set is required'),
    condition: z.enum(['NM', 'LP', 'MP', 'HP', 'DMG'], {
        error: 'condition must be one of: NM, LP, MP, HP, DMG',
    }),
    language: z.enum(['EN', 'JP', 'ES', 'DE', 'FR', 'IT', 'PT', 'KO', 'ZH'], {
        error: 'language must be one of: EN, JP, ES, DE, FR, IT, PT, KO, ZH',
    }),
    quantity: z.number().int().min(1, 'quantity must be at least 1'),
    price: z.number().min(0, 'price must be a non-negative number'),
    currency: z.string().min(1, 'currency is required').toUpperCase(),
    notes: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;