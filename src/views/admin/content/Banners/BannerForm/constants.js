import { z } from 'zod'

export const BANNER_DEFAULT_VALUES = {
    judul: '',
    keterangan: '',
    link: '',
    gambar: null,
    clear_gambar: false,
}

export const BANNER_VALIDATION_SCHEMA = z.object({
    judul: z.string().min(1, { message: 'Banner title is required!' }),
    keterangan: z.string().optional(),
    link: z.string().url('Invalid URL format').optional().or(z.literal('')),
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
                // The image is required for new banners, and optional for updates unless marked for clearing.
                return value !== null && (value.id || value.file)
            },
            {
                message: 'Banner image is required!',
            },
        ),
    clear_gambar: z.boolean().optional(),
})