// src/views/post/PostForm/constants.js
import { z } from 'zod';

export const POST_DEFAULT_VALUES = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '', 
    gallery_images: [], 
    meta_title: '',
    meta_description: '',
    author_id: null,
    status: 'draft',
    published_at: null,
    categories: [], 
    tags: [],      
    clear_featured_image: false,
    delete_gallery_image_ids: [], 
    clear_gallery_images: false,
};

export const POST_VALIDATION_SCHEMA = z.object({
    title: z.string().min(1, { message: 'Post title is required!' }),
    slug: z.string().optional(), 
    excerpt: z.string().optional(),
    content: z.string().min(1, { message: 'Post content is required!' }),
   featured_image: z.object({
        id: z.union([z.string(), z.number()]).optional(), 
        name: z.string().optional(),
        img: z.string().optional(), 
        file: z.instanceof(File).optional(), 
    }).nullable().optional(), 
    gallery_images: z.array(z.object({
        id: z.union([z.string(), z.number()]),
        name: z.string(),
        img: z.string(),
        file: z.instanceof(File).optional(), 
    })).optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    author_id: z.number().min(1, { message: 'Author is required!' }).nullable(),
    status: z.enum(['draft', 'published', 'archived']),
    published_at: z.date().nullable().optional(), 
    categories: z.array(z.number()).optional(),
    tags: z.array(z.number()).optional(),       
    clear_featured_image: z.boolean().optional(),
    delete_gallery_image_ids: z.array(z.number()).optional(),
    clear_gallery_images: z.boolean().optional(),
});