import { useState, useEffect, useCallback } from 'react';
import useSettings from './hooks/useSettings';
import { apiUpdateSettings } from '@/services/SettingService';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import SettingsForm from './SettingsForm';
import Container from '@/components/shared/Container';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import * as Yup from 'yup';
import appConfig from '@/configs/app.config';

const Settings = () => {
    const { settings, isLoading, error, mutateSettings } = useSettings();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);

    const [formData, setFormData] = useState({
        site_title: '',
        site_description: '',
        maintenance_mode: false,
        logo: null,
        meta_keywords: '',
        meta_description: '',
        mail_from_address: '',
        mail_from_name: '',
        smtp_host: '',
        smtp_port: null,
        smtp_username: '',
        smtp_password: '',
        clear_logo: false,
        maps_url: '',
        address: '',
        phone: '',
        power: '',
        power_url: '',
        short_title: '',
        email: '',
    });

    const [newLogoFile, setNewLogoFile] = useState(null);

    const validationSchema = Yup.object().shape({
        site_title: Yup.string().required('Site title is required!'),
        site_description: Yup.string(),
        maintenance_mode: Yup.boolean(),
        logo: Yup.string().nullable(),
        meta_keywords: Yup.string(),
        meta_description: Yup.string(),
        mail_from_address: Yup.string().email('Invalid email address!').nullable(),
        mail_from_name: Yup.string(),
        smtp_host: Yup.string().nullable(),
        smtp_port: Yup.number().nullable(true).min(0, 'Port cannot be negative!').typeError('Port must be a number!'),
        smtp_username: Yup.string().nullable(),
        smtp_password: Yup.string().nullable(),
        clear_logo: Yup.boolean(),
        maps_url: Yup.string().nullable(),
        address: Yup.string(),
        phone: Yup.string(),
        power: Yup.string(),
        power_url: Yup.string().nullable(),
        short_title: Yup.string(),
        email: Yup.string().email('Invalid email address!').nullable(),
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (settings) {
            setFormData({
                site_title: settings.general?.site_title || '',
                site_description: settings.general?.site_description || '',
                maintenance_mode: settings.general?.maintenance_mode || false,
                logo: settings.appearance?.logo 
                    ? `${appConfig.backendBaseUrl}${settings.appearance.logo}` 
                    : null,
                meta_keywords: settings.seo?.meta_keywords || '',
                meta_description: settings.seo?.meta_description || '',
                mail_from_address: settings.email?.mail_from_address || '',
                mail_from_name: settings.email?.mail_from_name || '',
                smtp_host: settings.email?.smtp_host || '',
                smtp_port: settings.email?.smtp_port || null,
                smtp_username: settings.email?.smtp_username || '',
                smtp_password: settings.email?.smtp_password || '',
                clear_logo: false,
                maps_url: settings.general?.maps_url || '',
                address: settings.general?.address || '',
                phone: settings.general?.phone || '',
                power: settings.general?.power || '',
                power_url: settings.general?.power_url || '',
                short_title: settings.general?.short_title || '',
                email: settings.general?.email || '',
            });
            setNewLogoFile(null);
            setFormErrors({});
        }
    }, [settings]);

    const validateForm = useCallback(async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setFormErrors({});
            return true;
        } catch (err) {
            const errors = {};
            err.inner.forEach(error => {
                errors[error.path] = error.message;
            });
            setFormErrors(errors);
            console.error("Validation errors:", errors);
            return false;
        }
    }, [formData, validationSchema]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => {
            const newData = {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            };
            setFormErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
            return newData;
        });
    }, []);

    const handleImageFileChange = useCallback((name, file) => {
        if (name === 'logo') {
            setNewLogoFile(file);
            setFormData((prevData) => ({
                ...prevData,
                logo: URL.createObjectURL(file),
                clear_logo: false,
            }));
            setFormErrors(prevErrors => { const newErrors = { ...prevErrors }; delete newErrors.logo; return newErrors; });
        }
    }, []);

    const handleImageRemove = useCallback((name) => {
        if (name === 'logo') {
            setNewLogoFile(null);
            setFormData((prevData) => ({
                ...prevData,
                logo: null,
                clear_logo: true,
            }));
        }
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();
        if (!isValid) {
            toast.push(
                <Notification type="danger" title="Validation Error">
                    Please correct the errors in the form.
                </Notification>,
                { placement: 'top-center' },
            );
            return;
        }

        setIsSubmitting(true);

        const formDataToSend = new FormData();

        for (const key in formData) {
            if (key !== 'logo' && key !== 'clear_logo' && formData[key] !== null && formData[key] !== undefined) {
                if (typeof formData[key] === 'boolean') {
                    formDataToSend.append(key, formData[key] ? 'true' : 'false');
                } else if (typeof formData[key] === 'number') {
                    formDataToSend.append(key, String(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
        }

        if (newLogoFile) {
            formDataToSend.append('logo', newLogoFile);
        }

        if (formData.clear_logo) {
            formDataToSend.append('clear_logo', 'true');
        }

        try {
            await apiUpdateSettings(formDataToSend);
            toast.push(
                <Notification type="success" title="Success">
                    Pengaturan berhasil diperbarui!
                </Notification>,
                { placement: 'top-center' },
            );
            mutateSettings();
            setNewLogoFile(null);
            setFormData(prevData => ({ ...prevData, clear_logo: false }));

        } catch (err) {
            console.error('Error updating settings:', err.response?.data || err.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Gagal memperbarui pengaturan: {err.response?.data?.details || err.message || 'Terjadi kesalahan tidak dikenal.'}
                </Notification>,
                { placement: 'top-center' },
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDiscard = useCallback(() => {
        setDiscardConfirmationOpen(true);
    }, []);

    const handleCancelDiscard = useCallback(() => {
        setDiscardConfirmationOpen(false);
    }, []);

    const handleConfirmDiscard = useCallback(() => {
        setDiscardConfirmationOpen(false);
        if (settings) {
            setFormData({
                site_title: settings.general?.site_title || '',
                site_description: settings.general?.site_description || '',
                maintenance_mode: settings.general?.maintenance_mode || false,
                logo: settings.appearance?.logo 
                    ? `${appConfig.backendBaseUrl}${settings.appearance.logo}` 
                    : null,
                meta_keywords: settings.seo?.meta_keywords || '',
                meta_description: settings.seo?.meta_description || '',
                mail_from_address: settings.email?.mail_from_address || '',
                mail_from_name: settings.email?.mail_from_name || '',
                smtp_host: settings.email?.smtp_host || '',
                smtp_port: settings.email?.smtp_port || null,
                smtp_username: settings.email?.smtp_username || '',
                smtp_password: settings.email?.smtp_password || '',
                clear_logo: false,
                maps_url: settings.general?.maps_url || '',
                address: settings.general?.address || '',
                phone: settings.general?.phone || '',
                power: settings.general?.power || '',
                power_url: settings.general?.power_url || '',
                short_title: settings.general?.short_title || '',
                email: settings.general?.email || '',
            });
            setNewLogoFile(null);
            setFormErrors({});
            toast.push(
                <Notification type="info" title="Changes Discarded">
                    Form changes have been discarded.
                </Notification>,
                { placement: 'top-center' },
            );
        }
    }, [settings]);

    if (isLoading) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Loading settings...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Error loading settings: {error.message}</div>
            </Container>
        );
    }

    return (
        <>
            <SettingsForm
                formData={formData}
                handleChange={handleChange}
                handleImageFileChange={handleImageFileChange}
                handleImageRemove={handleImageRemove}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="warning"
                title="Discard Changes"
                onClose={handleCancelDiscard}
                onRequestClose={handleCancelDiscard}
                onCancel={handleCancelDiscard}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want to discard all unsaved changes? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default Settings;