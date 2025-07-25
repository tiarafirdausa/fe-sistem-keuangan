// src/views/tag/TagForm/components/TagGeneralSection.jsx (adjust path as needed)
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';

const TagGeneralSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">Tag Information</h4>
            <div>
                <FormItem
                    label="Tag name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Tag Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Tag slug"
                    invalid={Boolean(errors.slug)}
                    errorMessage={errors.slug?.message}
                >
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="tag-slug-name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default TagGeneralSection;