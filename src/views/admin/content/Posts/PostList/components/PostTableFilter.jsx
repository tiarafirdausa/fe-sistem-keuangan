import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Badge from '@/components/ui/Badge'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { components } from 'react-select'
import { Form, FormItem } from '@/components/ui/Form'
import usePostList from '../hooks/usePostList'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import classNames from '@/utils/classNames'

import { apiGetAllCategories } from '@/services/CategoryService'
import { apiGetAllTags } from '@/services/TagService'

const { Control } = components

const postStatusOption = [
    { value: 'published', label: 'Published', className: 'bg-emerald-500' },
    { value: 'draft', label: 'Draft', className: 'bg-amber-400' },
    { value: 'archived', label: 'Archived', className: 'bg-red-500' },
]

const CustomSelectOption = (props) => {
    return (
        <DefaultOption
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Badge className={data.className} />
                    <span className="ml-2 rtl:mr-2">{label}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Badge className={classNames('ml-4', selected.className)} />
            )}
            {children}
        </Control>
    )
}

const validationSchema = z.object({
    categoryId: z.union([z.string().nullable(), z.number().nullable()]).nullable(),
    tagId: z.union([z.string().nullable(), z.number().nullable()]).nullable(),
    status: z.string().nullable(),
})

const PostTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    // State untuk opsi filter dinamis
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    const { filterData, setFilterData } = usePostList()

    const { handleSubmit, control, reset } = useForm({
        defaultValues: filterData,
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const categoriesRes = await apiGetAllCategories()
                if (Array.isArray(categoriesRes)) { 
                    setCategories(
                        categoriesRes.map((category) => ({
                            value: category.id,
                            label: category.name,
                        })),
                    )
                } else {
                    console.error("Categories data is not an array or response is malformed (expected array directly):", categoriesRes)
                    setCategories([]) 
                }

                const tagsRes = await apiGetAllTags()
                if (Array.isArray(tagsRes)) { 
                    setTags(
                        tagsRes.map((tag) => ({ 
                            value: tag.id,
                            label: tag.name,
                        })),
                    )
                } else {
                    console.error("Tags data is not an array or response is malformed (expected array directly):", tagsRes)
                    setTags([]) 
                }
            } catch (error) {
                console.error('Gagal mengambil opsi filter:', error)
            }
        }

        fetchFilterOptions()
    }, [])

    useEffect(() => {
        reset(filterData)
    }, [filterData, reset])

    const onSubmit = (values) => {
        const processedValues = {
            ...values,
            categoryId:
                values.categoryId !== null ? Number(values.categoryId) : null,
            tagId: values.tagId !== null ? Number(values.tagId) : null,
        }
        setFilterData(processedValues)
        setFilterIsOpen(false)
    }

    const handleClearFilters = () => {
        const clearedFilters = {
            categoryId: null,
            tagId: null,
            status: null,
        }
        setFilterData(clearedFilters)
        setFilterIsOpen(false)
    }

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
                        {/* Filter Status Posting */}
                        <FormItem label="Post status">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        options={postStatusOption}
                                        {...field}
                                        value={
                                            postStatusOption.find(
                                                (option) =>
                                                    option.value === field.value,
                                            ) || null
                                        }
                                        components={{
                                            Option: CustomSelectOption,
                                            Control: CustomControl,
                                        }}
                                        placeholder="Select status"
                                        onChange={(option) =>
                                            field.onChange(
                                                option?.value || null,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Filter Kategori */}
                        <FormItem label="Category">
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        options={categories}
                                        {...field}
                                        value={
                                            categories.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || null
                                        }
                                        placeholder="Select category"
                                        onChange={(option) =>
                                            field.onChange(
                                                option?.value || null,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Filter Tag */}
                        <FormItem label="Tag">
                            <Controller
                                isClearable
                                name="tagId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={tags}
                                        {...field}
                                        value={
                                            tags.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || null
                                        }
                                        placeholder="Select tag"
                                        onChange={(option) =>
                                            field.onChange(
                                                option?.value || null,
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="plain"
                            className="w-full"
                            onClick={handleClearFilters}
                        >
                            Clear All
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            className="w-full"
                        >
                            Apply Filters
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    )
}

export default PostTableFilter