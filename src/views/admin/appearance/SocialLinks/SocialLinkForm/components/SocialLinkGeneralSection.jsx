import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller, useWatch } from 'react-hook-form';
import Select from '@/components/ui/Select';
import Switcher from '@/components/ui/Switcher';
import { useEffect } from 'react';

const platformOptions = [
    { label: 'Whatsapp', value: 'whatsapp', icon: 'fab fa-whatsapp' },
    { label: 'Telegram', value: 'telegram', icon: 'fab fa-telegram-plane' },
    { label: 'Discord', value: 'discord', icon: 'fab fa-discord' },
    { label: 'GitHub', value: 'github', icon: 'fab fa-github' },
    { label: 'Facebook', value: 'facebook', icon: 'fab fa-facebook' },
    { label: 'Instagram', value: 'instagram', icon: 'fab fa-instagram' },
    { label: 'Twitter', value: 'twitter', icon: 'fab fa-twitter' },
    { label: 'LinkedIn', value: 'linkedin', icon: 'fab fa-linkedin-in' },
    { label: 'YouTube', value: 'youtube', icon: 'fab fa-youtube' },
    { label: 'TikTok', value: 'tiktok', icon: 'fab fa-tiktok' },
    { label: 'Website', value: 'website', icon: 'fas fa-globe' },
];

const SocialLinkGeneralSection = ({ control, errors, setValue }) => {
    const platform = useWatch({
        control,
        name: 'platform',
    });

    useEffect(() => {
        const selectedPlatform = platformOptions.find(
            (option) => option.value === platform
        );

        if (selectedPlatform) {
            setValue('icon_class', selectedPlatform.icon);
        }
    }, [platform, setValue]);

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
                                value={platformOptions.find(
                                    (option) => option.value === field.value
                                )}
                                onChange={(option) => field.onChange(option?.value)}
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