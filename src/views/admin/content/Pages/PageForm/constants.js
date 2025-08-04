// src/views/admin/content/Pages/PageForm/constants.js
import { z } from 'zod';

export const PAGE_DEFAULT_VALUES = {
    title: '',
    slug: '',
    content: '',
    featured_image: null, // Ubah dari string kosong menjadi null
    gallery_images: [],
    meta_title: '',
    meta_description: '',
    status: 'published',
    clear_featured_image: false,
    delete_gallery_image_ids: [],
    clear_gallery_images: false,
    author_id: '', // Tambahkan author_id ke default values
};

export const PAGE_VALIDATION_SCHEMA = z.object({
    title: z.string().min(1, { message: 'Page title is required!' }),
    slug: z.string().optional(),
    content: z.string().min(1, { message: 'Page content is required!' }),
    featured_image: z.object({
        id: z.union([z.string(), z.number()]).optional(),
        name: z.string().optional(),
        img: z.string(), // Ubah dari optional() menjadi required() jika ada
        file: z.instanceof(File).optional(),
    }).nullable(), // Izinkan null jika tidak ada gambar
    gallery_images: z.array(z.object({
        id: z.union([z.string(), z.number()]).optional(),
        name: z.string().optional(),
        img: z.string().optional(),
        file: z.instanceof(File).optional(),
    })).optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']),
    clear_featured_image: z.boolean().optional(),
    delete_gallery_image_ids: z.array(z.number()).optional(),
    clear_gallery_images: z.boolean().optional(),
    author_id: z.union([z.string(), z.number()]).optional(), // Izinkan string atau number
});