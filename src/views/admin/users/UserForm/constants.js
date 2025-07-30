// src/views/admin/users/UserForm/constants.js

import { z } from 'zod';

export const USER_DEFAULT_VALUES = {
    name: '',
    username: '',
    email: '',
    role: '',
    status: '',
    foto: null,
    password: '', 
    confirmPassword: '', 
    currentPassword: '', 
    newPassword: '',
    confirmNewPassword: '', 
    clear_foto: false,
};

export const getUserValidationSchema = (isEdit) => {
    return z.object({
        name: z.string()
            .trim() 
            .min(1, { message: 'Nama lengkap wajib diisi.' }) 
            .min(3, { message: 'Nama lengkap minimal 3 karakter.' }), 
        username: z.string()
            .trim() 
            .min(1, { message: 'Username wajib diisi.' }) 
            .min(3, { message: 'Username minimal 3 karakter.' }) 
            .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username hanya boleh berisi huruf, angka, dan underscore.' }), // Match backend regex
        email: z
            .string()
            .trim() 
            .min(1, { message: 'Email wajib diisi.' }) 
            .email({ message: 'Format email tidak valid.' }), 
        role: z.string()
            .min(1, { message: 'Role wajib diisi.' }) 
            .refine((val) => ['admin', 'editor', 'author', 'user'].includes(val), {
                message: 'Role tidak valid.', 
            }),
        status: z.string()
            .optional()
            .refine((val) => val === undefined || ['active', 'suspended'].includes(val), {
                message: 'Status tidak valid. Harus \'active\' atau \'suspended\'.', 
            }),
        foto: z.object({
            id: z.union([z.string(), z.number()]).optional(),
            name: z.string().optional(),
            img: z.string().optional(),
            file: z.instanceof(File).optional(),
        }).nullable().optional(),
        password: z.string().optional().transform(e => e === "" ? undefined : e),
        confirmPassword: z.string().optional().transform(e => e === "" ? undefined : e),
        currentPassword: z.string().optional().transform(e => e === "" ? undefined : e),
        newPassword: z.string().optional().transform(e => e === "" ? undefined : e),
        confirmNewPassword: z.string().optional().transform(e => e === "" ? undefined : e),
        clear_foto: z.boolean().optional(),
    }).superRefine((data, ctx) => {
        if (isEdit) {
            if (data.currentPassword || data.newPassword || data.confirmNewPassword) {
                if (!data.currentPassword) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Current password wajib diisi.',
                        path: ['currentPassword'],
                    });
                }
                if (!data.newPassword) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'New password wajib diisi.',
                        path: ['newPassword'],
                    });
                } else if (data.newPassword.length < 6) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'New password minimal 6 karakter.',
                        path: ['newPassword'],
                    });
                }
                if (!data.confirmNewPassword) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Konfirmasi password baru wajib diisi.',
                        path: ['confirmNewPassword'],
                    });
                } else if (data.newPassword && data.confirmNewPassword && data.newPassword !== data.confirmNewPassword) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Konfirmasi password baru tidak cocok.',
                        path: ['confirmNewPassword'],
                    });
                }
            }
        } else {
            if (!data.password) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Password wajib diisi.',
                    path: ['password'],
                });
            } else if (data.password.length < 6) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Password minimal 6 karakter.',
                    path: ['password'],
                });
            }

            if (!data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Konfirmasi password wajib diisi.',
                    path: ['confirmPassword'],
                });
            } else if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Password tidak cocok.',
                    path: ['confirmPassword'],
                });
            }
        }
    });
};