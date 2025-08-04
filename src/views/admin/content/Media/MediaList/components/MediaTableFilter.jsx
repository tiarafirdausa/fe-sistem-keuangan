import { useState, useMemo, useEffect } from 'react';
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
import { apiGetAllMediaCategories } from '@/services/MediaService';
import useMediaList from '../hooks/useMediaList';

const validationSchema = z.object({
    categoryId: z.string().optional(),
    authorId: z.string().optional(),
});

const MediaTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false);

    const { mediaFilterData, setMediaFilterData } = useMediaList();

    const { data: authorsData } = useSWR(
        '/api/users',
        async () => {
            const response = await apiGetAllUsers({ pageSize: 9999 });
            return response.users;
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const { data: categoriesData } = useSWR(
        '/api/media-categories',
        async () => {
            const response = await apiGetAllMediaCategories({ pageSize: 9999 });
            return response.mediaCategories;
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const authorOptions = useMemo(() => {
        return (
            authorsData?.map((author) => ({
                value: author.id.toString(), 
                label: author.name,
            })) || []
        );
    }, [authorsData]);

    const categoryOptions = useMemo(() => {
        return (
            categoriesData?.map((cat) => ({
                value: cat.id.toString(), 
                label: cat.name,
            })) || []
        );
    }, [categoriesData]);

    const { handleSubmit, control, reset} = useForm({
        defaultValues: {
            categoryId: mediaFilterData.categoryId || '',
            authorId: mediaFilterData.authorId || '',
        },
        resolver: zodResolver(validationSchema),
    });

    useEffect(() => {
        if (filterIsOpen) {
            reset({
                categoryId: mediaFilterData.categoryId || '',
                authorId: mediaFilterData.authorId || '',
            });
        }
    }, [filterIsOpen, mediaFilterData, reset]);

    const onSubmit = (values) => {
        setMediaFilterData({
            ...mediaFilterData,
            categoryId: values.categoryId,
            authorId: values.authorId,
            pageIndex: 1,
        });
        setFilterIsOpen(false);
    };

    const handleClearFilters = () => {
        reset({
            categoryId: '',
            authorId: '',
        });
        setMediaFilterData({
            ...mediaFilterData,
            categoryId: '',
            authorId: '',
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
                    onSubmit={(e) => {
                        handleSubmit(onSubmit)(e);
                    }}
                >
                    <div>
                        <FormItem label="Author">
                            <Controller
                                name="authorId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        options={authorOptions}
                                        {...field}
                                        value={authorOptions.find(
                                            (option) => option.value === field.value
                                        )}
                                        placeholder="Select an author"
                                        onChange={(option) =>
                                            field.onChange(option ? option.value : '')
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Categories">
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        options={categoryOptions}
                                        {...field}
                                        value={categoryOptions.find(
                                            (option) => option.value === field.value
                                        )}
                                        placeholder="Select a category"
                                        onChange={(option) =>
                                            field.onChange(option ? option.value : '')
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