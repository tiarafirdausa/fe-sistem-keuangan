// src/views/admin/appearance/Settings/SettingsForm/components/SeoSettingsSection.jsx
import { Input } from '@/components/ui';
import { FormItem } from '@/components/ui/Form';
import AdaptiveCard from '@/components/shared/AdaptiveCard'; // Use AdaptiveCard

const SeoSettingsSection = ({ formData, handleChange, errors }) => {
    return (
        <AdaptiveCard className="mb-4" bodyClass="p-6" title="SEO Settings">
            <FormItem label="Meta Keywords" invalid={!!errors.meta_keywords} errorMessage={errors.meta_keywords}>
                <Input
                    textArea
                    name="meta_keywords"
                    placeholder="e.g., website, development, react"
                    value={formData.meta_keywords || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="Meta Description" invalid={!!errors.meta_description} errorMessage={errors.meta_description}>
                <Input
                    textArea
                    name="meta_description"
                    placeholder="A concise description for search engines"
                    value={formData.meta_description || ''}
                    onChange={handleChange}
                />
            </FormItem>
        </AdaptiveCard>
    );
};

export default SeoSettingsSection;