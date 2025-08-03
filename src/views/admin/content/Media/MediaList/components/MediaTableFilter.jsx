// src/views/admin/content/Media/MediaList/components/MediaTableFilter.js

import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import Select from '@/components/ui/Select';
import { Form, FormItem } from '@/components/ui/Form';
import { TbFilter } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import { apiGetAllUsers } from '@/services/UserService';
import useMediaList from '../hooks/useMediaList';
import useMediaCategoryList from '../../MediaCategoryList/hooks/useMediaCategoryList'; // Impor hook kategori

const mediaTypeOptions = [
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'pdf', label: 'PDF' },
];

const validationSchema = z.object({
    type: z.string().optional(),
    uploadedBy: z.string().optional(),
    categoryId: z.string().optional(),
});

const MediaTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const { mediaFilterData, setMediaFilterData } = useMediaList();

    const { data: usersData } = useSWR(
        '/api/users',
        async () => {
            const response = await apiGetAllUsers();
            return response.users;
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const { mediaCategoryList } = useMediaCategoryList();

    const uploaderOptions = useMemo(() => {
        return (
            usersData?.map((user) => ({
                value: user.id.toString(),
                label: user.name,
            })) || []
        );
    }, [usersData]);

    const categoryOptions = useMemo(() => {
        return (
            mediaCategoryList?.map((category) => ({
                value: category.id.toString(),
                label: category.name,
            })) || []
        );
    }, [mediaCategoryList]);

    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            type: mediaFilterData.type || '',
            uploadedBy: mediaFilterData.uploadedBy || '',
            categoryId: mediaFilterData.categoryId || '',
        },
        resolver: zodResolver(validationSchema),
    });

    useEffect(() => {
        if (filterIsOpen) {
            reset({
                type: mediaFilterData.type || '',
                uploadedBy: mediaFilterData.uploadedBy || '',
                categoryId: mediaFilterData.categoryId || '',
            });
        }
    }, [filterIsOpen, mediaFilterData, reset]);

    const onSubmit = (values) => {
        setMediaFilterData({
            ...mediaFilterData,
            type: values.type,
            uploadedBy: values.uploadedBy,
            categoryId: values.categoryId,
            pageIndex: 1,
        });
        setFilterIsOpen(false);
    };

    const handleClearFilters = () => {
        reset({
            type: '',
            uploadedBy: '',
            categoryId: '',
        });
        setMediaFilterData({
            ...mediaFilterData,
            type: '',
            uploadedBy: '',
            categoryId: '',
            pageIndex: 1,
        });
        setFilterIsOpen(false);
    };

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setFilterIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Media"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <Form
                    className="h-full"
                    containerClassName="flex flex-col justify-between h-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        {/* Filter by Media Type */}
                        <FormItem label="Media Type">
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        options={mediaTypeOptions}
                                        {...field}
                                        value={mediaTypeOptions.find(
                                            (option) =>
                                                option.value === field.value
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Media Category">
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        options={categoryOptions}
                                        {...field}
                                        value={categoryOptions.find(
                                            (option) =>
                                                option.value === field.value
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Uploader">
                            <Controller
                                name="uploadedBy"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        options={uploaderOptions}
                                        {...field}
                                        value={uploaderOptions.find(
                                            (option) =>
                                                option.value === field.value
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <Button
                            variant="plain"
                            type="button"
                            onClick={handleClearFilters}
                        >
                            Clear All
                        </Button>
                        <Button variant="solid" type="submit">
                            Apply Filters
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    );
};

export default MediaTableFilter;