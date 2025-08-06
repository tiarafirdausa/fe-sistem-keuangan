// src/views/admin/menus/components/MenuItemGeneralSection.jsx
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useSWR from 'swr'
import { apiGetAllMenuItems } from '@/services/MenuService'
import { apiGetAllPosts } from '@/services/PostService'
import { apiGetAllCategories } from '@/services/CategoryService'
import { apiGetAllPages } from '@/services/PageService'

const menuItemTypeOptions = [
    { label: 'Custom URL', value: 'custom' },
    { label: 'Post', value: 'post' },
    { label: 'Category', value: 'category' },
    { label: 'Page', value: 'page' },
]

const menuItemTargetOptions = [
    { label: 'Same Window/Tab', value: '_self' },
    { label: 'New Window/Tab', value: '_blank' },
]

const referenceIdFetchers = {
    post: apiGetAllPosts,
    category: apiGetAllCategories,
    page: apiGetAllPages,
}

const MenuItemGeneralSection = ({ control, errors, watchedType, menuId }) => {
    // eslint-disable-next-line no-unused-vars
    const fetcher = async ([_, params]) => {
        try {
            const response = await apiGetAllMenuItems(params)
            return response.data
        } catch (error) {
            console.error('Error in apiGetAllMenuItems:', error)
            throw error
        }
    }

    const { data: allMenuItems, isLoading: menuItemsLoading } = useSWR(
        menuId
            ? ['/menu-items', { menuId: parseInt(menuId), pageSize: 9999 }]
            : null,
        fetcher,
        {
            revalidateOnFocus: false,
        },
    )

    // eslint-disable-next-line no-unused-vars
    const referenceDataFetcher = async ([_, type]) => {
        const fetcherFunction = referenceIdFetchers[type]
        if (!fetcherFunction) {
            return []
        }
        const params = { pageSize: 9999 }
        const response = await fetcherFunction(params)
        if (type === 'category') {
            return response.categories
        } else if (type === 'page' ) {
            return response.data
        } else if (type === 'post') {
            return response.data
        }
    }

    const { data: referenceOptionsData, isLoading: referenceOptionsLoading } =
        useSWR(
            watchedType !== 'custom' ? ['/reference-data', watchedType] : null,
            referenceDataFetcher,
            { revalidateOnFocus: false },
        )

    const parentOptions = (allMenuItems || []).map((item) => ({
        label: item.title,
        value: item.id,
    }))

    const referenceOptions = (referenceOptionsData || []).map((item) => ({
        label: item.title || item.name,
        value: item.id,
    }))

    return (
        <Card>
            <h4 className="mb-6">Menu Item Information</h4>
            <FormContainer>
                <FormItem
                    label="Menu ID"
                    invalid={Boolean(errors.menu_id)}
                    errorMessage={errors.menu_id?.message}
                    className="hidden"
                >
                    <Controller
                        name="menu_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                disabled
                                type="number"
                                {...field}
                                value={field.value || ''}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Parent Menu Item (optional)"
                    invalid={Boolean(errors.parent_id)}
                    errorMessage={errors.parent_id?.message}
                >
                    <Controller
                        name="parent_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isClearable
                                placeholder={
                                    menuItemsLoading
                                        ? 'Loading...'
                                        : 'Select a parent item'
                                }
                                options={[
                                    { label: 'No Parent', value: null },
                                    ...parentOptions,
                                ]}
                                value={
                                    parentOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    ) ||
                                    (field.value === null
                                        ? { label: 'No Parent', value: null }
                                        : null)
                                }
                                isLoading={menuItemsLoading}
                                onChange={(selectedOption) =>
                                    field.onChange(selectedOption?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Title */}
                <FormItem
                    label="Menu Item Title"
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
                                placeholder="Menu Item Title"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Type */}
                <FormItem
                    label="Menu Item Type"
                    invalid={Boolean(errors.type)}
                    errorMessage={errors.type?.message}
                >
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={menuItemTypeOptions}
                                value={menuItemTypeOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(selectedOption) =>
                                    field.onChange(selectedOption?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                
                {watchedType !== 'custom' && (
                    <FormItem
                        label={`Reference ID (${watchedType})`}
                        invalid={Boolean(errors.reference_id)}
                        errorMessage={errors.reference_id?.message}
                    >
                        <Controller
                            name="reference_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isSearchable
                                    placeholder={
                                        referenceOptionsLoading
                                            ? 'Loading...'
                                            : 'Select a reference item'
                                    }
                                    options={referenceOptions}
                                    value={referenceOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    isLoading={referenceOptionsLoading}
                                    onChange={(selectedOption) =>
                                        field.onChange(selectedOption?.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                )}

                {/* URL (conditionally rendered based on type) */}
                {watchedType === 'custom' && (
                    <FormItem
                        label="URL"
                        invalid={Boolean(errors.url)}
                        errorMessage={errors.url?.message}
                    >
                        <Controller
                            name="url"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="e.g., /about-us or https://example.com"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )}

                {/* Target */}
                <FormItem
                    label="Open In"
                    invalid={Boolean(errors.target)}
                    errorMessage={errors.target?.message}
                >
                    <Controller
                        name="target"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={menuItemTargetOptions}
                                value={menuItemTargetOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(selectedOption) =>
                                    field.onChange(selectedOption?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Order */}
                <FormItem
                    label="Order"
                    invalid={Boolean(errors.order)}
                    errorMessage={errors.order?.message}
                >
                    <Controller
                        name="order"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                autoComplete="off"
                                placeholder="Order (e.g., 0)"
                                {...field}
                                value={field.value}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        )}
                    />
                </FormItem>
            </FormContainer>
        </Card>
    )
}

export default MenuItemGeneralSection
