import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { FormItem, FormContainer } from '@/components/ui/Form'; 
import { Controller } from 'react-hook-form';

const menuItemTypeOptions = [
    { label: 'Custom URL', value: 'custom' },
    { label: 'Post', value: 'post' },
    { label: 'Category', value: 'category' },
    { label: 'Page', value: 'page' },
];

const menuItemTargetOptions = [
    { label: 'Same Window/Tab', value: '_self' },
    { label: 'New Window/Tab', value: '_blank' },
];

const MenuItemGeneralSection = ({ control, errors, watchedType }) => {
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
                            <Input
                                type="number"
                                placeholder="Enter parent item ID (optional)"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val === '' ? null : Number(val));
                                }}
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
                                value={menuItemTypeOptions.find((option) => option.value === field.value)}
                                onChange={(selectedOption) => field.onChange(selectedOption?.value)}
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
                                <Input
                                    type="number"
                                    autoComplete="off"
                                    placeholder={`ID of the ${watchedType} (e.g., Post ID)`}
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        field.onChange(val === '' ? null : Number(val));
                                    }}
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
                                value={menuItemTargetOptions.find((option) => option.value === field.value)}
                                onChange={(selectedOption) => field.onChange(selectedOption?.value)}
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
                                value={field.value} // Maintain number type
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        )}
                    />
                </FormItem>
            </FormContainer>
        </Card>
    );
};

export default MenuItemGeneralSection;