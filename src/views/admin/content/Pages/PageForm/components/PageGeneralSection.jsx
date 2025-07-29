import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { RichTextEditor } from '@/components/shared';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';

const PageGeneralSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">General Information</h4>
            <div className="flex flex-col gap-4">
                <FormItem
                    label="Page Title"
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
                                placeholder="Page Title"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Page Slug"
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
                                placeholder="page-title-slug"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Content"
                    invalid={Boolean(errors.content)}
                    errorMessage={errors.content?.message}
                >
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                value={field.value}
                                onChange={(valueObject) => {
                                    field.onChange(valueObject.html);
                                }}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default PageGeneralSection;