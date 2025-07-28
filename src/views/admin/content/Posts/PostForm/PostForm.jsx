// src/views/post/PostForm/PostForm.jsx
import { useEffect } from 'react';
import { Form } from '@/components/ui/Form';
import Container from '@/components/shared/Container';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import PostGeneralSection from './components/PostGeneralSection';
import PostImageSection from './components/PostImageSection';
import PostSeoSection from './components/PostSeoSection';
import PostDetailsSection from './components/PostDetailsSection';
import PostCategoryTagSection from './components/PostCategoryTagSection';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';
import { POST_DEFAULT_VALUES, POST_VALIDATION_SCHEMA } from './constants';

const PostForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = POST_DEFAULT_VALUES,
        users = [],
        categories = [],
        tags = [],
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
            featured_image: (defaultValues.featured_image && defaultValues.featured_image !== '')
                ? { id: 'existing-featured', img: defaultValues.featured_image, name: 'featured_image' }
                : null, 
            gallery_images: defaultValues.gallery_images || [],
            categories: defaultValues.categories || [],
            tags: defaultValues.tags || [],
            clear_featured_image: false,
            delete_gallery_image_ids: [],
            clear_gallery_images: false,
        },
        resolver: zodResolver(POST_VALIDATION_SCHEMA),
    });

    useEffect(() => {
        if (!isEmpty(defaultValues) && JSON.stringify(defaultValues) !== JSON.stringify(POST_DEFAULT_VALUES)) {
            const transformedDefaultValues = {
                ...defaultValues,
                featured_image: (defaultValues.featured_image && typeof defaultValues.featured_image === 'string' && defaultValues.featured_image !== '')
                    ? { id: 'existing-featured', img: defaultValues.featured_image, name: 'featured_image' }
                    : (defaultValues.featured_image || null), 
                gallery_images: defaultValues.gallery_images?.map(img => ({
                    id: img.id,
                    img: img.image_path,
                    name: img.alt_text || `gallery_image_${img.id}`
                })) || [],
                categories: defaultValues.categories?.map(cat => cat.id) || [],
                tags: defaultValues.tags?.map(tag => tag.id) || [],
                clear_featured_image: false,
                delete_gallery_image_ids: [],
                clear_gallery_images: false,
            };
            reset(transformedDefaultValues);
        } else if (JSON.stringify(defaultValues) === JSON.stringify(POST_DEFAULT_VALUES)) {
            reset({
                ...POST_DEFAULT_VALUES,
                featured_image: null,
                gallery_images: [],
                categories: [],
                tags: [],
                clear_featured_image: false,
                delete_gallery_image_ids: [],
                clear_gallery_images: false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues), reset]);

    const onSubmit = (values) => {
        const formData = new FormData();

        for (const key in values) {
            if (key === 'featured_image') {
                if (values.featured_image && values.featured_image.file instanceof File) {
                    formData.append('featured_image', values.featured_image.file);
                }
                // Jika ini adalah objek gambar yang sudah ada (tanpa 'file' baru),
                // Anda mungkin perlu mengirimkan URL-nya atau ID-nya ke backend
                // Tergantung API Anda, Anda mungkin perlu menambahkan logic di sini
                // Contoh:
                // else if (values.featured_image && values.featured_image.img && !values.featured_image.file) {
                //     formData.append('featured_image_url', values.featured_image.img);
                // }
            } else if (key === 'gallery_images') {
                values.gallery_images.forEach((image) => {
                    if (image.file) {
                        formData.append('gallery_images', image.file);
                    }
                });
            } else if (key === 'categories' || key === 'tags') {
                if (Array.isArray(values[key]) && values[key].length > 0) {
                    formData.append(key, JSON.stringify(values[key]));
                }
            } else if (values[key] !== undefined && values[key] !== null) {
                if (typeof values[key] === 'boolean') {
                    formData.append(key, values[key] ? 'true' : 'false');
                } else if (values[key] instanceof Date) {
                    formData.append(key, values[key].toISOString());
                }
                else {
                    formData.append(key, values[key]);
                }
            }
        }

        formData.append('clear_featured_image', getValues('clear_featured_image') ? 'true' : 'false');
        if (getValues('delete_gallery_image_ids')?.length > 0) {
            formData.append('delete_gallery_image_ids', JSON.stringify(getValues('delete_gallery_image_ids')));
        }
        formData.append('clear_gallery_images', getValues('clear_gallery_images') ? 'true' : 'false');


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
                            <PostGeneralSection control={control} errors={errors} />
                            <PostImageSection control={control} errors={errors} setValue={setValue} getValues={getValues} />
                        </div>
                    </div>
                    <div className="xl:flex-col xl:w-[320px] lg:w-full">
                        <div className="flex flex-col gap-4">
                            <PostDetailsSection control={control} errors={errors} users={users} />
                            <PostCategoryTagSection control={control} errors={errors} categories={categories} tags={tags} />
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