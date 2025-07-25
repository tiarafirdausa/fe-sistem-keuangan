import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';
import Select from '@/components/ui/Select';
import Switcher from '@/components/ui/Switcher'; 
import Tooltip from '@/components/ui/Tooltip'; 
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'; 

const platformOptions = [
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'TikTok', value: 'tiktok' },
    { label: 'Website', value: 'website' },
    // Add more platforms as needed
];

const SocialLinkGeneralSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">Social Link Information</h4>
            <div>
                <FormItem
                    label="Platform"
                    invalid={Boolean(errors.platform)}
                    errorMessage={errors.platform?.message}
                >
                    <Controller
                        name="platform"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={platformOptions}
                                placeholder="Select Platform"
                                value={platformOptions.filter(
                                    (option) => option.value === field.value
                                )}
                                onChange={(option) => field.onChange(option.value)}
                            />
                        )}
                    />
                </FormItem>

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
                                placeholder="https://example.com/yourpage"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={
                        <div className="flex items-center gap-1">
                            Icon Class
                            <Tooltip
                                title={
                                    <span>
                                        Enter a{' '}
                                        <a
                                            href="https://fontawesome.com/icons?d=gallery&m=free"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            Font Awesome
                                        </a>{' '}
                                        class (e.g., `fab fa-facebook`).
                                    </span>
                                }
                            >
                                <HiOutlineQuestionMarkCircle />
                            </Tooltip>
                        </div>
                    }
                    invalid={Boolean(errors.icon_class)}
                    errorMessage={errors.icon_class?.message}
                >
                    <Controller
                        name="icon_class"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="fab fa-instagram"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Is Active"
                    invalid={Boolean(errors.is_active)}
                    errorMessage={errors.is_active?.message}
                >
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                            <Switcher
                                checked={field.value === 1}
                                onChange={(checked) => field.onChange(checked ? 1 : 0)}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default SocialLinkGeneralSection;