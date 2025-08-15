// PageTableFilter.jsx or PageTableFilter.js
import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import Select from '@/components/ui/Select';
import { Form, FormItem } from '@/components/ui/Form';
import { TbFilter } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import usePageList from '../hooks/usePageList';
import { apiGetAllUsers } from '@/services/UserService';
import useSWR from 'swr';

const validationSchema = z.object({
    author_id: z.union([z.number(), z.string()]).optional(),
});

const PageTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false);

    const { pageFilterData, setPageFilterData } = usePageList();

    const { data: usersData } = useSWR(
        '/api/users',
        async () => {
            const response = await apiGetAllUsers({ pageSize: 9999 });
            return response.users;
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const authorOptions = useMemo(() => {
        return usersData?.map(user => ({ value: user.id, label: user.name })) || [];
    }, [usersData]);

    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            author_id: pageFilterData.author_id || '',
        },
        resolver: zodResolver(validationSchema),
    });

    useEffect(() => {
        if (filterIsOpen) {
            reset({
                author_id: pageFilterData.author_id || '',
            });
        }
    }, [filterIsOpen, pageFilterData, reset]);

    const onSubmit = (values) => {
        setPageFilterData({
            ...pageFilterData,
            author_id: values.author_id,
            pageIndex: 1,
        });
        setFilterIsOpen(false);
    };

    const handleClearFilters = () => {
        reset({
            author_id: '',
        });
        setPageFilterData({
            ...pageFilterData,
            author_id: '',
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
                title="Filter Pages"
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
                        <FormItem label="Author">
                            <Controller
                                isClearable
                                name="author_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={authorOptions}
                                        {...field}
                                        value={authorOptions.find(
                                            (option) => option.value === field.value,
                                        )}
                                        placeholder="Select an author"
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

export default PageTableFilter;