// src/views/admin/content/Posts/PostForm/PostForm.jsx
import { useEffect } from 'react';
import { Form } from '@/components/ui/Form';
import Container from '@/components/shared/Container';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import PostGeneralSection from './components/PostGeneralSection'; 
import PostImageSection from './components/PostImageSection';     
import PostAttributeSection from './components/PostAttributeSection'; 
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';

const validationSchema = z.object({
    title: z.string().min(1, { message: 'Post title required!' }),
    slug: z.string().optional(), 
    excerpt: z.string().optional(),
    content: z.string().min(1, { message: 'Post content required!' }),
    author_id: z.number().min(1, { message: 'Author required!' }), 
    status: z.enum(['draft', 'published', 'archived'], { message: 'Invalid status!' }),
    published_at: z.string().optional().nullable(),
    
    featured_image_file: z.any() 
        .optional()
        .refine((file) => !file || file.type.startsWith('image/'), "Only image files are allowed for featured image.")
        .refine((file) => !file || file.size <= 2 * 1024 * 1024, `Featured image size should be less than 2MB.`),
    
    existing_featured_image_path: z.string().optional().nullable(),
    clear_featured_image: z.boolean().optional(), 

    gallery_image_files: z.array(z.any())
        .optional()
        .refine((files) => {
            if (!files || files.length === 0) return true;
            return files.every(file => file.type.startsWith('image/'));
        }, "Only image files are allowed for gallery images.")
        .refine((files) => {
            if (!files || files.length === 0) return true;
            return files.every(file => file.size <= 2 * 1024 * 1024);
        }, `Gallery image size should be less than 2MB per file.`),

   existing_gallery_images: z.array(z.object({
        id: z.number(),
        image_path: z.string(),
        alt_text: z.string().optional().nullable(),
        sort_order: z.number().optional()
    })).optional(),
    delete_gallery_image_ids: z.array(z.number()).optional(), 
    clear_all_gallery_images: z.boolean().optional(),


    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    categories: z.array(z.number()).optional(), 
    tags: z.array(z.number()).optional(),       
});


const PostForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            author_id: null, 
            status: 'draft',
            published_at: null,
            featured_image_file: null,
            existing_featured_image_path: null,
            clear_featured_image: false,
            gallery_image_files: [],
            existing_gallery_images: [],
            delete_gallery_image_ids: [],
            clear_all_gallery_images: false,
            meta_title: '',
            meta_description: '',
            categories: [],
            tags: [],
        },
        children,
    } = props;

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
        watch 
    } = useForm({
        defaultValues: {
            ...defaultValues,
            published_at: defaultValues.published_at ? new Date(defaultValues.published_at).toISOString().split('T')[0] : null,
        },
        resolver: zodResolver(validationSchema),
    });

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            const formattedDefaultValues = {
                ...defaultValues,
                published_at: defaultValues.published_at ? new Date(defaultValues.published_at).toISOString().split('T')[0] : null,
            };
            reset(formattedDefaultValues);
        }
    }, [reset, defaultValues]);

    const onSubmit = (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        if (values.slug) formData.append('slug', values.slug);
        if (values.excerpt) formData.append('excerpt', values.excerpt);
        formData.append('content', values.content);
        formData.append('author_id', values.author_id);
        formData.append('status', values.status);
        if (values.published_at) formData.append('published_at', values.published_at);
        if (values.meta_title) formData.append('meta_title', values.meta_title);
        if (values.meta_description) formData.append('meta_description', values.meta_description);

        if (values.categories && values.categories.length > 0) {
            values.categories.forEach(catId => formData.append('categories[]', catId));
        }
        if (values.tags && values.tags.length > 0) {
            values.tags.forEach(tagId => formData.append('tags[]', tagId));
        }

        if (values.featured_image_file) {
            formData.append('featured_image', values.featured_image_file);
        } else if (values.clear_featured_image) {
            formData.append('clear_featured_image', 'true');
        }
        
        if (values.gallery_image_files && values.gallery_image_files.length > 0) {
            values.gallery_image_files.forEach(file => {
                formData.append('gallery_images', file); 
            });
        }
        if (values.clear_all_gallery_images) {
            formData.append('clear_gallery_images', 'true'); 
        }
        if (values.delete_gallery_image_ids && values.delete_gallery_image_ids.length > 0) {
            formData.append('delete_gallery_image_ids', JSON.stringify(values.delete_gallery_image_ids));
        }

        console.log('Form values before FormData conversion:', values);
for (let pair of formData.entries()) {
    console.log(pair[0]+ ': ' + pair[1]);
}
        
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
                    <div className="gap-4 flex flex-col flex-auto">
                        <PostGeneralSection control={control} errors={errors} />
                        <PostAttributeSection control={control} errors={errors} />
                    </div>
                    <div className="lg:min-w-[440px] 2xl:w-[500px] gap-4 flex flex-col">
                        <PostImageSection 
                            control={control} 
                            errors={errors} 
                            setValue={setValue} 
                            watch={watch}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    );
};

export default PostForm;