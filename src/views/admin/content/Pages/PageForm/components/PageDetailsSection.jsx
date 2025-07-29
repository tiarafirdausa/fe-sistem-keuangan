import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';

const PageDetailsSection = ({ control, errors }) => {
    const statusOptions = [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
    ];

    return (
        <Card>
            <h4 className="mb-6">Page Details</h4>
            <div className="flex flex-col gap-4">
                {/* Author ID and Published At are typically not relevant for static pages, removed */}
                {/* <FormItem
                    label="Author ID"
                    invalid={Boolean(errors.author_id)}
                    errorMessage={errors.author_id?.message}
                >
                    <Controller
                        name="author_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                autoComplete="off"
                                placeholder="Author ID"
                                value={field.value || ''}
                                disabled={true}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || null)}
                            />
                        )}
                    />
                </FormItem> */}

                <FormItem
                    label="Status"
                    invalid={Boolean(errors.status)}
                    errorMessage={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={statusOptions}
                                value={statusOptions.find(option => option.value === field.value)}
                                placeholder="Select Status"
                                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
                            />
                        )}
                    />
                </FormItem>

                {/* <FormItem
                    label="Published At"
                    invalid={Boolean(errors.published_at)}
                    errorMessage={errors.published_at?.message}
                >
                    <Controller
                        name="published_at"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value ? new Date(field.value) : null}
                                placeholder="Select Publish Date"
                                enableCloseOnSelect={true}
                                onChange={(date) => field.onChange(date)}
                            />
                        )}
                    />
                </FormItem> */}
            </div>
        </Card>
    );
};

export default PageDetailsSection;