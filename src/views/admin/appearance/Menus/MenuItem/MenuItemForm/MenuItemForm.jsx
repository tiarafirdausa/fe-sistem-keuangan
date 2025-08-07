// src/views/admin/menus/MenuItemForm.jsx
import { useEffect } from 'react';
import { Form } from '@/components/ui/Form';
import Container from '@/components/shared/Container';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import MenuItemGeneralSection from './components/MenuItemGeneralSection';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';

const validationSchema = z.object({
    menu_id: z.number({ message: 'Menu ID required!' }).min(1, { message: 'Menu ID must be a positive number!' }),
    parent_id: z.number().nullable().optional(), 
    title: z.string().min(1, { message: 'Menu item title required!' }),
    url: z.string().optional().nullable(), 
    type: z.enum(['custom', 'category', 'page', 'post', 'media', 'media_category'], { message: 'Invalid menu item type!' }),
    reference_id: z.number().nullable().optional(),
    target: z.enum(['_self', '_blank'], { message: 'Invalid target value!' }).optional(),
    order: z.number().int().min(0, { message: 'Order must be a non-negative integer!' }).optional(),
}).superRefine((data, ctx) => {
    if (data.type === 'custom' && !data.url) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "URL is required for 'custom' menu items.",
            path: ['url'],
        });
    }
    if (['category', 'page', 'media_category'].includes(data.type) && !data.reference_id) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Reference ID is required for '${data.type}' menu items.`,
            path: ['reference_id'],
        });
    }
});

const MenuItemForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = {
            menu_id: null,
            parent_id: null,
            title: '',
            url: '',
            type: 'custom',
            reference_id: null,
            target: '_self',
            order: 0,
        },
        menuId,
        children,
    } = props;

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch, 
    } = useForm({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    });

    const watchedType = watch('type'); 

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)]);

    const onSubmit = (values) => {
        onFormSubmit?.(values);
    };

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <MenuItemGeneralSection
                            control={control}
                            errors={errors}
                            watchedType={watchedType}
                            menuId={menuId} 
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    );
};

export default MenuItemForm;