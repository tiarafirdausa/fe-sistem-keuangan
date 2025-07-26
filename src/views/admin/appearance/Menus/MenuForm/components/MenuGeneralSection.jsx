import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';

const MenuGeneralSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">Menu Information</h4>
            <div>
                <FormItem
                    label="Menu name"
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
                                placeholder="Menu Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Menu slug"
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
                                placeholder="menu-slug-name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default MenuGeneralSection;