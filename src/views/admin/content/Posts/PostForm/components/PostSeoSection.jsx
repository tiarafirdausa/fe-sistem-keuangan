// src/views/post/PostForm/components/PostSeoSection.jsx
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';

const PostSeoSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">SEO Information</h4>
            <div className="flex flex-col gap-4">
                <FormItem
                    label="Meta Title"
                    invalid={Boolean(errors.meta_title)}
                    errorMessage={errors.meta_title?.message}
                >
                    <Controller
                        name="meta_title"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Meta Title for SEO"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Meta Description"
                    invalid={Boolean(errors.meta_description)}
                    errorMessage={errors.meta_description?.message}
                >
                    <Controller
                        name="meta_description"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Meta Description for SEO"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default PostSeoSection;