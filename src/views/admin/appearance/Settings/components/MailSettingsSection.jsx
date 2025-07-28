// src/views/admin/appearance/Settings/SettingsForm/components/MailSettingsSection.jsx
import { Input } from '@/components/ui';
import { FormItem } from '@/components/ui/Form';
import AdaptiveCard from '@/components/shared/AdaptiveCard'; // Use AdaptiveCard
import NumericInput from '@/components/shared/NumericInput'; // Use NumericInput

const MailSettingsSection = ({ formData, handleChange, errors }) => {
    return (
        <AdaptiveCard className="mb-4" bodyClass="p-6" title="Mail Settings (SMTP)">
            <FormItem label="From Address" invalid={!!errors.mail_from_address} errorMessage={errors.mail_from_address}>
                <Input
                    type="email"
                    name="mail_from_address"
                    placeholder="e.g., no-reply@yourdomain.com"
                    value={formData.mail_from_address || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="From Name" invalid={!!errors.mail_from_name} errorMessage={errors.mail_from_name}>
                <Input
                    name="mail_from_name"
                    placeholder="e.g., Your Website Name"
                    value={formData.mail_from_name || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="SMTP Host" invalid={!!errors.smtp_host} errorMessage={errors.smtp_host}>
                <Input
                    name="smtp_host"
                    placeholder="e.g., smtp.mailtrap.io"
                    value={formData.smtp_host || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="SMTP Port" invalid={!!errors.smtp_port} errorMessage={errors.smtp_port}>
                <NumericInput 
                    value={formData.smtp_port}
                    placeholder="e.g., 2525"
                    onChange={(val) => handleChange({ target: { name: 'smtp_port', value: val } })}
                />
            </FormItem>
            <FormItem label="SMTP Username" invalid={!!errors.smtp_username} errorMessage={errors.smtp_username}>
                <Input
                    name="smtp_username"
                    placeholder="SMTP Username"
                    value={formData.smtp_username || ''}
                    onChange={handleChange}
                />
            </FormItem>
            <FormItem label="SMTP Password" invalid={!!errors.smtp_password} errorMessage={errors.smtp_password}>
                <Input
                    type="password"
                    name="smtp_password"
                    placeholder="SMTP Password"
                    value={formData.smtp_password || ''}
                    onChange={handleChange}
                />
            </FormItem>
        </AdaptiveCard>
    );
};

export default MailSettingsSection;