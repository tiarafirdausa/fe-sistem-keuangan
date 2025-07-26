// src/views/admin/content/Posts/PostForm/components/PostGeneralSection.jsx
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import RichTextEditor from '@/components/shared/RichTextEditor';
import { Controller } from 'react-hook-form';

const PostGeneralSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">Basic Information</h4>
            <div className="mb-4">
                <FormItem
                    label="Post Title"
                    invalid={Boolean(errors.title)}
                    errorMessage={errors.title?.message}
                >
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Post Title"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <div className="mb-4">
                <FormItem
                    label="Slug (Optional)"
                    invalid={Boolean(errors.slug)}
                    errorMessage={errors.slug?.message}
                >
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="post-title-slug"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <div className="mb-4">
                <FormItem
                    label="Excerpt (Optional)"
                    invalid={Boolean(errors.excerpt)}
                    errorMessage={errors.excerpt?.message}
                >
                    <Controller
                        name="excerpt"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                componentAs="textarea"
                                autoComplete="off"
                                placeholder="A short summary of the post..."
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem
                label="Content"
                invalid={Boolean(errors.content)}
                errorMessage={errors.content?.message}
            >
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            value={field.value}
                            invalid={Boolean(errors.content)}
                            onChange={(editorState) => {
                                const htmlString = editorState?.html || ''; 
                                field.onChange(htmlString); 
                            }}
                        />
                    )}
                />
            </FormItem>
        </Card>
    );
};

export default PostGeneralSection;