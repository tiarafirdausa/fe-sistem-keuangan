import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import Select, { Option as DefaultOption } from '@/components/ui/Select';
import { components } from 'react-select';
import { Form, FormItem } from '@/components/ui/Form';
import { TbFilter } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classNames from '@/utils/classNames';
// import useSWR from 'swr'; // useSWR masih dipertahankan jika ada kebutuhan lain
// import { apiGetAllUsers } from '@/services/UserService'; // Import API untuk users (penulis) - DIKOMENTARI
import usePageList from '../hooks/usePageList'; // Menggunakan hook usePageList

const { Control } = components;

const pageStatusOption = [
    { value: 'published', label: 'Published', className: 'bg-emerald-500' },
    { value: 'draft', label: 'Draft', className: 'bg-gray-400' },
    { value: 'archived', label: 'Archived', className: 'bg-red-500' },
];

const CustomStatusSelectOption = (props) => {
    return (
        <DefaultOption
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <span className={classNames('w-2 h-2 rounded-full', data.className)} />
                    <span className="ml-2 rtl:mr-2">{label}</span>
                </span>
            )}
        />
    );
};

const CustomStatusControl = ({ children, ...props }) => {
    const selected = props.getValue()[0];
    return (
        <Control {...props}>
            {selected && (
                <span className={classNames('w-2 h-2 rounded-full ml-4', selected.className)} />
            )}
            {children}
        </Control>
    );
};

// Skema validasi untuk Page
const validationSchema = z.object({
    status: z.string().optional(),
    // authorId: z.array(z.number()).optional(), // authorId DIHAPUS
});

const PageTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false);

    const { pageFilterData, setPageFilterData } = usePageList();

    // Mengambil data pengguna (users) untuk filter penulis - DIKOMENTARI/DIHAPUS
    // const { data: usersData } = useSWR(
    //     '/api/users',
    //     async () => {
    //         const response = await apiGetAllUsers();
    //         return response.users;
    //     },
    //     { revalidateOnFocus: false, revalidateIfStale: false }
    // );

    // const authorOptions = useMemo(() => { // authorOptions DIHAPUS
    //     return usersData?.map(user => ({ value: user.id, label: user.name })) || [];
    // }, [usersData]);

    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            status: pageFilterData.status || '',
            // authorId: pageFilterData.authorId || [], // authorId DIHAPUS
        },
        resolver: zodResolver(validationSchema),
    });

    useEffect(() => {
        if (filterIsOpen) {
            reset({
                status: pageFilterData.status || '',
                // authorId: pageFilterData.authorId || [], // authorId DIHAPUS
            });
        }
    }, [filterIsOpen, pageFilterData, reset]);

    const onSubmit = (values) => {
        setPageFilterData({
            ...pageFilterData,
            status: values.status,
            // authorId: values.authorId, // authorId DIHAPUS
            pageIndex: 1,
        });
        setFilterIsOpen(false);
    };

    const handleClearFilters = () => {
        reset({
            status: '',
            // authorId: [], // authorId DIHAPUS
        });
        setPageFilterData({
            ...pageFilterData,
            status: '',
            // authorId: '', // authorId DIHAPUS
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
                        <FormItem label="Page status">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={pageStatusOption}
                                        {...field}
                                        value={pageStatusOption.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        components={{
                                            Option: CustomStatusSelectOption,
                                            Control: CustomStatusControl,
                                        }}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        {/* FormItem Author DIHAPUS */}
                        {/* <FormItem label="Author">
                            <Controller
                                name="authorId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        options={authorOptions}
                                        {...field}
                                        value={authorOptions.filter(option =>
                                            field.value.includes(option.value)
                                        )}
                                        placeholder="Select authors"
                                        onChange={(selectedOptions) =>
                                            field.onChange(selectedOptions ? selectedOptions.map(opt => opt.value) : [])
                                        }
                                    />
                                )}
                            />
                        </FormItem> */}

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