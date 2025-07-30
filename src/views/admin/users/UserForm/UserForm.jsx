// src/views/admin/users/UserForm/index.jsx
import { useEffect } from 'react';
import { Form } from '@/components/ui/Form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import Container from '@/components/shared/Container';
import { getUserValidationSchema } from '@/views/admin/users/UserForm/constants';

import ProfileInformation from '@/views/admin/users/UserForm/components/ProfileInformation';
import PasswordSection from '@/views/admin/users/UserForm/components/PasswordSection';

const UserForm = (props) => {
    const {
        onFormSubmit,
        defaultValues,
        children,
        isEdit = false,
    } = props;

    const methods = useForm({
        resolver: zodResolver(getUserValidationSchema(isEdit)),
        defaultValues: defaultValues,
    });

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
        watch,
    } = methods;


     useEffect(() => {
        if (defaultValues) {
            reset(defaultValues, {
                keepErrors: false,
                keepDirty: false,
                keepIsSubmitted: false,
                keepTouched: false,
                keepIsValid: false,
                resolver: zodResolver(getUserValidationSchema(isEdit)),
            });
        }
    }, [defaultValues, reset, isEdit]); 

    const onSubmit = (values) => {
        const formData = new FormData();
        formData.append('name', values.name); 
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('role', values.role);
        formData.append('status', values.status);

        if (values.foto?.file) {
            formData.append('foto', values.foto.file);
        } else if (values.clear_foto) {
            formData.append('clear_foto', 'true');
        }

        if (isEdit) { 
            if (values.currentPassword) {
                formData.append('current_password', values.currentPassword);
            }
            if (values.newPassword) {
                formData.append('new_password', values.newPassword);
            }
            if (values.newPassword && values.confirmNewPassword) {
                formData.append('new_password_confirmation', values.confirmNewPassword);
            }
        } else { 
            if (values.password) {
                formData.append('password', values.password);
            }
            if (values.password && values.confirmPassword) {
                formData.append('password_confirmation', values.confirmPassword);
            }
        }


        onFormSubmit?.(formData);
    };

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <ProfileInformation
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            watch={watch}
                        />
                        <PasswordSection
                            control={control}
                            errors={errors}
                            isEdit={isEdit}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    );
};

export default UserForm;