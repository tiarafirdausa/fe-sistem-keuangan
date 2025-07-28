// src/views/admin/appearance/Settings/SettingsForm/components/GeneralSettingsSection.jsx
import { Input, Switcher } from '@/components/ui'; // Use Switcher
import { FormItem } from '@/components/ui/Form';
import AdaptiveCard from '@/components/shared/AdaptiveCard'; // Use AdaptiveCard
import ImageUploadField from './ImageUploadField';

const GeneralSettingsSection = ({ formData, handleChange, handleImageFileChange, handleImageRemove, errors }) => {
    return (
        <AdaptiveCard className="mb-4" bodyClass="p-6" title="General Settings">
            <FormItem label="Site Title" invalid={!!errors.site_title} errorMessage={errors.site_title}>
                <Input
                    name="site_title"
                    placeholder="Your Website Title"
                    value={formData.site_title || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="Site Description" invalid={!!errors.site_description} errorMessage={errors.site_description}>
                <Input
                    textArea
                    name="site_description"
                    placeholder="A short description of your website"
                    value={formData.site_description || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="Maintenance Mode">
                <Switcher // Use Switcher instead of Switch
                    checked={formData.maintenance_mode}
                    onChange={(checked) => handleChange({ target: { name: 'maintenance_mode', value: checked } })}
                />
            </FormItem>

            <ImageUploadField
                label="Website Ikon"
                name="ikon"
                currentImageUrl={formData.ikon}
                error={errors.ikon}
                onFileChange={handleImageFileChange}
                onRemove={handleImageRemove}
            />

            <ImageUploadField
                label="Website Logo"
                name="logo"
                currentImageUrl={formData.logo}
                error={errors.logo}
                onFileChange={handleImageFileChange}
                onRemove={handleImageRemove}
            />
        </AdaptiveCard>
    );
};

export default GeneralSettingsSection;