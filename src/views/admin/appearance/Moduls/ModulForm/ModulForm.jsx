import { useEffect } from 'react';
import { Form } from '@/components/ui/Form';
import Container from '@/components/shared/Container';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import ModulGeneralSection from './components/ModulGeneralSection';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';

const validationSchema = z
    .object({
        judul: z.string().min(1, { message: 'Judul modul wajib diisi!' }),
        folder: z.string().min(1, { message: 'Folder wajib diisi!' }),
        widget: z.boolean(),
        home: z.boolean(),
        aktif: z.boolean(),
        order: z.number().int().min(0, { message: 'Urutan harus berupa angka positif atau 0.' }),
    })
    .refine(
        (data) => data.widget || data.home,
        {
            message: 'Setidaknya satu dari Widget atau Home harus dipilih.',
            path: ['widget'], 
        },
    );

const ModulForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = {
            judul: '',
            folder: '',
            widget: false,
            home: false,
            aktif: true,
            order: 0,
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
    }, [JSON.stringify(defaultValues), reset]);

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
                        <ModulGeneralSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    );
};

export default ModulForm;