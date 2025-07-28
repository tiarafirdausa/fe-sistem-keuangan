// src/views/admin/appearance/Settings/SettingsForm/SettingsForm.jsx
import { Button } from '@/components/ui';
import Container from '@/components/shared/Container';
import { FormContainer } from '@/components/ui/Form';
import GeneralSettingsSection from '../components/GeneralSettingsSection'; 
import SeoSettingsSection from '../components/SeoSettingsSection';     
import MailSettingsSection from '../components/MailSettingsSection';   
import BottomStickyBar from '@/components/template/BottomStickyBar';
import { TbTrash } from 'react-icons/tb';

const SettingsForm = ({
    formData,
    handleChange,
    handleImageFileChange,
    handleImageRemove,
    formErrors,
    onFormSubmit,
    isSubmitting,
    onDiscard, 
}) => {
    return (
        <form  className="flex flex-auto flex-col" onSubmit={onFormSubmit}>
            <Container className="h-full">
                <FormContainer>
                    <GeneralSettingsSection
                        formData={formData}
                        handleChange={handleChange}
                        handleImageFileChange={handleImageFileChange}
                        handleImageRemove={handleImageRemove}
                        errors={formErrors}
                    />
                    <SeoSettingsSection
                        formData={formData}
                        handleChange={handleChange}
                        errors={formErrors}
                    />
                    <MailSettingsSection
                        formData={formData}
                        handleChange={handleChange}
                        errors={formErrors}
                    />
                    
                </FormContainer>
            </Container>

            <BottomStickyBar>
            <div className="flex items-center justify-end gap-1 px-8">
                <Button
                    className="ltr:mr-3 rtl:ml-3"
                    type="button"
                    customColorClass={() =>
                       'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                    }
                    icon={<TbTrash />}
                    onClick={onDiscard}
                >
                    Discard
                </Button>
                <Button
                    variant="solid"
                    type="submit"
                    loading={isSubmitting}
                >
                    Save Changes
                </Button>
            </div>
            </BottomStickyBar>
        </form>
    );
};

export default SettingsForm;