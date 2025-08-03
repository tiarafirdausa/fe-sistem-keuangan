// src/views/admin/content/Media/MediaForm/MediaGeneralSection.jsx

import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { FormItem } from '@/components/ui/Form';
import { RichTextEditor } from '@/components/shared';
import { Controller } from 'react-hook-form';
import useSWR from 'swr';
import { apiGetAllMediaCategories } from '@/services/MediaService';

const MediaGeneralSection = ({ control, errors }) => {
    const { data: categories,  isLoading: isLoadingCategories } = useSWR(
        '/media-categories',
        async () => {
            const response = await apiGetAllMediaCategories({ pageSize: 9999 });
            return response;
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const categoryOptions = categories?.mediaCategories?.map(category => ({
        label: category.name,
        value: category.id,
    })) || [];

    return (
        <Card>
            <h4 className="mb-6">General Information</h4>
            <div className="flex flex-col gap-4">
                <FormItem
                    label="Media Title"
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
                                placeholder="Media Title"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Media Category"
                    invalid={Boolean(errors.category_id)}
                    errorMessage={errors.category_id?.message}
                >
                    <Controller
                        name="category_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find(option => option.value === field.value)}
                                isLoading={isLoadingCategories}
                                placeholder="Select a category"
                                onChange={(option) => field.onChange(option ? option.value : null)}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Caption"
                    invalid={Boolean(errors.caption)}
                    errorMessage={errors.caption?.message}
                >
                    <Controller
                        name="caption"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                value={field.value}
                                onChange={(valueObject) => {
                                    field.onChange(valueObject.html);
                                }}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default MediaGeneralSection;