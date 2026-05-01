export type ProductType = 'sealed' | 'single';

export type ProductCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';

export type ProductLanguage = 'EN' | 'JP' | 'ES' | 'DE' | 'FR' | 'IT' | 'PT' | 'KO' | 'ZH';

export interface Product {
    id: string;
    name: string;
    type: ProductType;
    set: string;
    condition: ProductCondition;
    language: ProductLanguage;
    quantity: number;
    price: number;
    currency: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}