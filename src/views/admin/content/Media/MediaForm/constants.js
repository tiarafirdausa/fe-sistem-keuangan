import { z } from 'zod';

export const MEDIA_DEFAULT_VALUES = {
    title: '',
    caption: '',
    category_id: null,
    media: [],
    featured_image: null,
    meta_title: '',
    meta_description: '',
    clear_media_files: false,
    delete_media_file_ids: [],
};

export const MEDIA_VALIDATION_SCHEMA = z.object({
    title: z.string().min(1, { message: 'Media title is required!' }),
    caption: z.string().min(1, { message: 'Media caption is required!' }),
    category_id: z.coerce.number().min(1, { message: 'Media category is required!' }),
    media: z.array(z.any()).min(1, { message: 'At least one media file is required!' }),
    featured_image: z.any().nullable().refine(value => value !== null, {
        message: 'Featured image is required!',
    }),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    clear_media_files: z.boolean().optional(),
    delete_media_file_ids: z.array(z.number()).optional(),
    clear_featured_image: z.boolean().optional(),
});