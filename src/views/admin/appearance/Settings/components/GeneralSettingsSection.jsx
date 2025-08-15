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
            <FormItem label="Short Title" invalid={!!errors.short_title} errorMessage={errors.short_title}>
                <Input
                    name="short_title"
                    placeholder="Short Title"
                    value={formData.short_title || ''}
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
            <FormItem label="Address" invalid={!!errors.address} errorMessage={errors.address}>
                <Input
                    textArea
                    name="address"
                    placeholder="Your Company Address"
                    value={formData.address || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="Phone" invalid={!!errors.phone} errorMessage={errors.phone}>
                <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="Maps URL" invalid={!!errors.maps_url} errorMessage={errors.maps_url}>
                <Input
                    name="maps_url"
                    placeholder="Google Maps URL"
                    value={formData.maps_url || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="Power" invalid={!!errors.power} errorMessage={errors.power}>
                <Input
                    name="power"
                    placeholder="Powered by..."
                    value={formData.power || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="Power URL" invalid={!!errors.power_url} errorMessage={errors.power_url}>
                <Input
                    name="power_url"
                    placeholder="Powered by URL"
                    value={formData.power_url || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="Maintenance Mode">
                <Switcher
                    checked={formData.maintenance_mode}
                    onChange={(checked) => handleChange({ target: { name: 'maintenance_mode', value: checked } })}
                />
            </FormItem>

            <ImageUploadField
                label="Logo"
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