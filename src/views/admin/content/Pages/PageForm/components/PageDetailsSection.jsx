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
            </div>
        </Card>
    );
};

export default PageDetailsSection;