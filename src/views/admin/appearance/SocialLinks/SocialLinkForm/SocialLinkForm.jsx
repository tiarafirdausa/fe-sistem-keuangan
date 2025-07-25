import { useEffect } from 'react';
import { Form } from '@/components/ui/Form';
import Container from '@/components/shared/Container';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import SocialLinkGeneralSection from './components/SocialLinkGeneralSection';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';

const validationSchema = z.object({
    platform: z.string().min(1, { message: 'Platform is required!' }),
    url: z.string().url('Invalid URL format').min(1, { message: 'URL is required!' }),
    icon_class: z.string().optional(),
    is_active: z.number().int().min(0).max(1), 
});

const SocialLinkForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = {
            platform: '',
            url: '',
            icon_class: '',
            is_active: 1, 
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
                        <SocialLinkGeneralSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    );
};

export default SocialLinkForm;