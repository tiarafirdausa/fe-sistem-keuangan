// src/views/post/PostForm/PostForm.jsx
import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import PostGeneralSection from './components/PostGeneralSection'
import PostImageSection from './components/PostImageSection'
import PostSeoSection from './components/PostSeoSection'
import PostDetailsSection from './components/PostDetailsSection'
import PostCategoryTagSection from './components/PostCategoryTagSection'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import { POST_DEFAULT_VALUES, POST_VALIDATION_SCHEMA } from './constants'

const PostForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = POST_DEFAULT_VALUES,
        currentUser,
        categories = [],
        tags = [],
        children,
    } = props

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        defaultValues,
        resolver: zodResolver(POST_VALIDATION_SCHEMA),
    })

    const postAuthorNameForDisplay =
        defaultValues.author_name || currentUser?.name;

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues);
        }
    }, [reset, defaultValues]);


    const onSubmit = (values) => {
        const formData = new FormData();

        for (const key in values) {
            if (key === 'featured_image') {
                if (
                    values.featured_image &&
                    values.featured_image.file instanceof File
                ) {
                    formData.append(
                        'featured_image',
                        values.featured_image.file,
                    );
                }
            } else if (key === 'gallery_images') {
                values.gallery_images.forEach((image) => {
                    if (image.file) {
                        formData.append('gallery_images', image.file);
                    }
                });
            } else if (key === 'categories' || key === 'tags') {
                if (Array.isArray(values[key]) && values[key].length > 0) {
                    values[key].forEach((id) => {
                        formData.append(key, id);
                    });
                }
            } else if (
                key === 'delete_gallery_image_ids' ||
                key === 'clear_featured_image' ||
                key === 'clear_gallery_images'
            ) {
                continue;
            } else if (values[key] !== undefined && values[key] !== null) {
                if (values[key] instanceof Date) {
                    formData.append(key, values[key].toISOString());
                } else if (typeof values[key] === 'boolean') {
                    formData.append(key, values[key] ? 'true' : 'false');
                } else {
                    formData.append(key, values[key]);
                }
            }
        }

        formData.append(
            'clear_featured_image',
            getValues('clear_featured_image') ? 'true' : 'false',
        );
        if (getValues('delete_gallery_image_ids')?.length > 0) {
            formData.append(
                'delete_gallery_image_ids',
                JSON.stringify(getValues('delete_gallery_image_ids')),
            );
        }
        formData.append(
            'clear_gallery_images',
            getValues('clear_gallery_images') ? 'true' : 'false',
        );

        onFormSubmit?.(formData);
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
                            <PostGeneralSection
                                control={control}
                                errors={errors}
                            />
                            <PostImageSection
                                control={control}
                                errors={errors}
                                setValue={setValue}
                                getValues={getValues}
                            />
                        </div>
                    </div>
                    <div className="xl:flex-col xl:w-[320px] lg:w-full">
                        <div className="flex flex-col gap-4">
                            <PostDetailsSection
                                control={control}
                                errors={errors}
                                currentUser={currentUser}
                                postAuthorNameForDisplay={
                                    postAuthorNameForDisplay
                                }
                            />
                            <PostCategoryTagSection
                                control={control}
                                errors={errors}
                                categories={categories}
                                tags={tags}
                            />
                            <PostSeoSection control={control} errors={errors} />
                        </div>
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    );
};

export default PostForm;