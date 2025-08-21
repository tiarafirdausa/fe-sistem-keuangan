// src/views/admin/content/Media/MediaForm/constants.js
import { z } from 'zod';

export const MEDIA_DEFAULT_VALUES = {
    title: '',
    caption: '',
    category_id: null, 
    media: [],
    meta_title: '',
    meta_description: '',
    clear_media_files: false,
    delete_media_file_ids: [],
};

export const MEDIA_VALIDATION_SCHEMA = z.object({
    title: z.string().min(1, { message: 'Media title is required!' }),
    caption: z.string().optional(),
    category_id: z.number({ 
        required_error: "Media category is required!"
    }).min(1, { message: "Media category is required!" }), 
    media: z.array(z.object({
        id: z.union([z.string(), z.number()]).optional(),
        name: z.string().optional(),
        url: z.string().optional(),
        file: z.instanceof(File).optional(),
        croppedFile: z.instanceof(File).optional(),
    })).min(1, { message: 'At least one media file is required!' }),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    clear_media_files: z.boolean().optional(),
    delete_media_file_ids: z.array(z.number()).optional(),
});