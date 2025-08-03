// src/views/admin/content/Media/MediaForm/MediaForm.jsx
import { useEffect } from 'react';
import { Form } from '@/components/ui/Form';
import Container from '@/components/shared/Container';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import MediaGeneralSection from './components/MediaGeneralSection';
import MediaImageSection from './components/MediaImageSection';
import appConfig from '@/configs/app.config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';
import { MEDIA_DEFAULT_VALUES, MEDIA_VALIDATION_SCHEMA } from './constants';

const MediaForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = MEDIA_DEFAULT_VALUES,
        children,
    } = props;

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            ...defaultValues,
            media:
                defaultValues.media?.map((file) => ({
                    id: file.id,
                    url: `${appConfig.backendBaseUrl}${file.file_path}`,
                    name: file.name,
                })) || [],
            clear_media_files: false,
            delete_media_file_ids: [],
        },
        resolver: zodResolver(MEDIA_VALIDATION_SCHEMA),
    });

    useEffect(() => {
        if (
            !isEmpty(defaultValues) &&
            JSON.stringify(defaultValues) !==
                JSON.stringify(MEDIA_DEFAULT_VALUES)
        ) {
            const transformedDefaultValues = {
                ...defaultValues,
                media:
                    defaultValues.media?.map((file) => ({
                        id: file.id,
                        url: `${appConfig.backendBaseUrl}${file.file_path}`,
                        name: file.name,
                    })) || [],
                clear_media_files: false,
                delete_media_file_ids: [],
            };
            reset(transformedDefaultValues);
        } else if (
            JSON.stringify(defaultValues) ===
            JSON.stringify(MEDIA_DEFAULT_VALUES)
        ) {
            reset({
                ...MEDIA_DEFAULT_VALUES,
                media: [],
                clear_media_files: false,
                delete_media_file_ids: [],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues), reset]);

    const onSubmit = (values) => {
        const formData = new FormData();

        for (const key in values) {
            if (
                key === 'media' ||
                key === 'delete_media_file_ids' ||
                key === 'clear_media_files'
            ) {
                continue;
            }

            if (values[key] !== undefined && values[key] !== null) {
                if (values[key] instanceof Date) {
                    formData.append(key, values[key].toISOString());
                } else if (typeof values[key] === 'boolean') {
                    formData.append(key, values[key] ? 'true' : 'false');
                } else {
                    formData.append(key, values[key]);
                }
            }
        }

        values.media.forEach((file) => {
            if (file.file instanceof File) {
                formData.append('media', file.file);
            }
        });
        
        formData.append(
            'clear_media_files',
            getValues('clear_media_files') ? 'true' : 'false',
        );

        onFormSubmit?.(formData, getValues());
    };

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="xl:flex-1">
                        <div className="flex flex-col gap-4">
                            <MediaGeneralSection
                                control={control}
                                errors={errors}
                            />
                            <MediaImageSection
                                control={control}
                                errors={errors}
                                setValue={setValue}
                                getValues={getValues}
                            />
                        </div>
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    );
};

export default MediaForm;