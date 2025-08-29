import { z } from 'zod';

export const LINK_DEFAULT_VALUES = {
    judul: '',
    keterangan: '',
    kategori: '',
    link: '',
    gambar: null,
    clear_gambar: false,
};

export const LINK_VALIDATION_SCHEMA = z.object({
    judul: z.string().min(1, { message: 'Link title is required!' }),
    keterangan: z.string().optional(),
    kategori: z.string().min(1, { message: 'Category is required!' }),
    link: z.string().url('Invalid URL format').min(1, { message: 'URL is required!' }),
    gambar: z
        .object({
            id: z.union([z.string(), z.number()]).optional(),
            name: z.string().optional(),
            img: z.string().optional(),
            file: z.instanceof(File).optional(),
        })
        .nullable()
        .refine(
            (value) => {
                return value !== null && (value.id || value.file);
            },
            {
                message: 'Link image is required!',
            },
        ),
    clear_gambar: z.boolean().optional(),
});