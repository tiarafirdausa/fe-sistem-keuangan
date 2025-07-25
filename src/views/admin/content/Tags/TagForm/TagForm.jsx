// src/views/tag/TagForm/TagForm.jsx (adjust path as needed)
import { useEffect } from 'react';
import { Form } from '@/components/ui/Form';
import Container from '@/components/shared/Container';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import TagGeneralSection from './components/TagGeneralSection'; 
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Tag name required!' }),
    slug: z.string().optional(),
});

const TagForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = {
            name: '',
            slug: '',
        },
        children,
    } = props;

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    });

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
                        <TagGeneralSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    );
};

export default TagForm;