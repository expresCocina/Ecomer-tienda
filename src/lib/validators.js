import { z } from 'zod';

// ============================================
// VALIDACIONES PARA PRODUCTOS
// ============================================

export const productSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200, 'El nombre es muy largo'),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').optional().or(z.literal('')),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    offer_price: z.number().min(0, 'El precio de oferta debe ser mayor o igual a 0').optional().nullable(),
    cost_price: z.number().min(0, 'El costo debe ser mayor o igual a 0').optional().nullable(),
    stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
    category_id: z.string().uuid('Selecciona una categoría válida').optional().nullable(),
    is_offer: z.boolean().default(false),
    is_featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
}).refine(
    (data) => {
        if (data.offer_price && data.price) {
            return data.offer_price < data.price;
        }
        return true;
    },
    {
        message: 'El precio de oferta debe ser menor al precio normal',
        path: ['offer_price'],
    }
);

// ============================================
// VALIDACIONES PARA CATEGORÍAS
// ============================================

export const categorySchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es muy largo'),
    slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres').max(100, 'El slug es muy largo'),
    description: z.string().optional().or(z.literal('')),
});

// ============================================
// VALIDACIONES PARA CHECKOUT
// ============================================

export const checkoutSchema = z.object({
    customer_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200, 'El nombre es muy largo'),
    customer_email: z.string().email('Email inválido').optional().or(z.literal('')),
    customer_phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos').max(20, 'El teléfono es muy largo'),
    customer_address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres').max(500, 'La dirección es muy larga'),
    notes: z.string().max(1000, 'Las notas son muy largas').optional().or(z.literal('')),
});

// ============================================
// VALIDACIONES PARA AUTH
// ============================================

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

// ============================================
// VALIDACIONES PARA CONFIGURACIÓN
// ============================================

export const settingsSchema = z.object({
    business_name: z.string().min(2, 'El nombre del negocio debe tener al menos 2 caracteres').max(200),
    currency: z.string().length(3, 'El código de moneda debe tener 3 caracteres'),
    contact_email: z.string().email('Email inválido').optional().or(z.literal('')),
    contact_phone: z.string().optional().or(z.literal('')),
    contact_address: z.string().optional().or(z.literal('')),
});
