// src/views/post/PostForm/components/PostCategoryTagSection.jsx
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';

const PostCategoryTagSection = ({ control, errors, categories = [], tags = [] }) => {

    const categoryOptions = categories.map(cat => ({
        label: cat.name,
        value: cat.id
    }));

    const tagOptions = tags.map(tag => ({
        label: tag.name,
        value: tag.id
    }));

    return (
        <Card>
            <h4 className="mb-6">Categories & Tags</h4>
            <div className="flex flex-col gap-4">
                <FormItem
                    label="Categories"
                    invalid={Boolean(errors.categories)}
                    errorMessage={errors.categories?.message}
                >
                    <Controller
                        name="categories"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find(option => option.value === field.value)}
                                placeholder="Select a Category"
                                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Tags"
                    invalid={Boolean(errors.tags)}
                    errorMessage={errors.tags?.message}
                >
                    <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isMulti
                                options={tagOptions}
                                value={tagOptions.filter(option => field.value?.includes(option.value))}
                                placeholder="Select Tags"
                                onChange={(selectedOptions) => field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : [])}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default PostCategoryTagSection;