import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';

const LinkGeneralSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">General Information</h4>
            <div className="flex flex-col gap-4">
                <FormItem
                    label="Link Title"
                    invalid={Boolean(errors.judul)}
                    errorMessage={errors.judul?.message}
                >
                    <Controller
                        name="judul"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Link Title"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Description"
                    invalid={Boolean(errors.keterangan)}
                    errorMessage={errors.keterangan?.message}
                >
                    <Controller
                        name="keterangan"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Short description for the link"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Category"
                    invalid={Boolean(errors.kategori)}
                    errorMessage={errors.kategori?.message}
                >
                    <Controller
                        name="kategori"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="e.g., Social Media, Partnership"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Link URL"
                    invalid={Boolean(errors.link)}
                    errorMessage={errors.link?.message}
                >
                    <Controller
                        name="link"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="https://example.com"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default LinkGeneralSection;