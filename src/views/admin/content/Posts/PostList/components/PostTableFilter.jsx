import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { components } from 'react-select'
import { Form, FormItem } from '@/components/ui/Form'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import classNames from '@/utils/classNames'
import useSWR from 'swr' 
import { apiGetAllCategories } from '@/services/CategoryService'
import { apiGetAllTags } from '@/services/TagService'
import { apiGetAllUsers } from '@/services/UserService'
import usePostList from '../hooks/usePostList'

const { Control } = components

const postStatusOption = [
    { value: 'published', label: 'Published', className: 'bg-emerald-500' },
    { value: 'draft', label: 'Draft', className: 'bg-gray-400' },
    { value: 'archived', label: 'Archived', className: 'bg-red-500' },
]

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
    )
}

const CustomStatusControl = ({ children, ...props }) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <span className={classNames('w-2 h-2 rounded-full ml-4', selected.className)} />
            )}
            {children}
        </Control>
    )
}

const validationSchema = z.object({
    status: z.string().optional(), 
    categoryId: z.array(z.number()).optional(),
    tagId: z.array(z.number()).optional(),
    authorId: z.string().optional(),
})

const PostTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const { postFilterData, setPostFilterData } = usePostList()

    const { data: authorsData } = useSWR(
        '/api/users',
        async () => {
            const response = await apiGetAllUsers({ pageSize: 9999 }); 
            return response.users;
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const { data: categoriesData } = useSWR(
        '/api/categories', 
        async () => {
            const response = await apiGetAllCategories({ pageSize: 9999 }); 
            return response.categories; 
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const { data: tagsData } = useSWR(
        '/api/tags',  
        async () => {
            const response = await apiGetAllTags({ pageSize: 9999 }); 
            return response.tags; 
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const authorOptions = useMemo(() => {
        return authorsData?.map(author => ({ value: author.id.toString(), label: author.name })) || [];
    }, [authorsData]);

    const categoryOptions = useMemo(() => {
        return categoriesData?.map(cat => ({ value: cat.id, label: cat.name })) || [];
    }, [categoriesData]);

    const tagOptions = useMemo(() => {
        return tagsData?.map(tag => ({ value: tag.id, label: tag.name })) || [];
    }, [tagsData]);


    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            status: postFilterData.status || '',
            categoryId: postFilterData.categoryId || [],
            tagId: postFilterData.tagId || [],
            authorId: postFilterData.authorId || '',
        },
        resolver: zodResolver(validationSchema),
    })

    useState(() => {
        if (filterIsOpen) {
            reset({
                status: postFilterData.status || '',
                categoryId: postFilterData.categoryId || [],
                tagId: postFilterData.tagId || [],
                authorId: postFilterData.authorId || null,
            });
        }
    }, [filterIsOpen, postFilterData, reset]);


    const onSubmit = (values) => {
        setPostFilterData({
            ...postFilterData, 
            status: values.status,
            categoryId: values.categoryId,
            tagId: values.tagId,
            authorId: values.authorId,
            pageIndex: 1, 
        });
        setFilterIsOpen(false); 
    }

    const handleClearFilters = () => {
        reset({
            status: '',
            categoryId: [],
            tagId: [],
            authorId: '',
        });

        setPostFilterData({
            ...postFilterData,
            status: '',
            categoryId: '', 
            tagId: '',   
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
                title="Filter Posts"
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
                        <FormItem label="Post status">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={postStatusOption}
                                        {...field}
                                        value={postStatusOption.find(
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

                        <FormItem label="Categories">
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        options={categoryOptions}
                                        {...field}
                                        value={categoryOptions.filter(option =>
                                            field.value.includes(option.value)
                                        )}
                                        placeholder="Select categories"
                                        onChange={(selectedOptions) =>
                                            field.onChange(selectedOptions ? selectedOptions.map(opt => opt.value) : [])
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Tags">
                            <Controller
                                name="tagId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        options={tagOptions}
                                        {...field}
                                        value={tagOptions.filter(option =>
                                            field.value.includes(option.value)
                                        )}
                                        placeholder="Select tags"
                                        onChange={(selectedOptions) =>
                                            field.onChange(selectedOptions ? selectedOptions.map(opt => opt.value) : [])
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
    )
}

export default PostTableFilter