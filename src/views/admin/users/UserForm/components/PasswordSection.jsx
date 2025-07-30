// src/views/admin/users/UserForm/components/PasswordSection.jsx
import { Controller } from 'react-hook-form';
import { FormItem } from '@/components/ui/Form';
import Card from '@/components/ui/Card';
import { PasswordInput } from '@/components/shared';

const PasswordSection = ({ control, errors, isEdit }) => {
    return (
        <Card>
            <h5 className="mb-4 mt-0">Password</h5>
            <p className="mb-4">
                Remember, your password is your digital key to your account.
                Keep it safe, keep it secure!
            </p>
            {isEdit ? (
                <>
                    <FormItem
                        label="Current password"
                        invalid={Boolean(errors.currentPassword)}
                        errorMessage={errors.currentPassword?.message}
                    >
                        <Controller
                            name="currentPassword" 
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    type="password"
                                    autoComplete="off"
                                    placeholder="•••••••••"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="New password"
                        invalid={Boolean(errors.newPassword)}
                        errorMessage={errors.newPassword?.message}
                    >
                        <Controller
                            name="newPassword" 
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    type="password"
                                    autoComplete="off"
                                    placeholder="•••••••••"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Confirm new password"
                        invalid={Boolean(errors.confirmNewPassword)}
                        errorMessage={errors.confirmNewPassword?.message}
                    >
                        <Controller
                            name="confirmNewPassword"
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    type="password"
                                    autoComplete="off"
                                    placeholder="•••••••••"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </>
            ) : (
                <>
                    <FormItem
                        label="Password" 
                        invalid={Boolean(errors.password)} 
                        errorMessage={errors.password?.message} 
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    type="password"
                                    autoComplete="off"
                                    placeholder="•••••••••"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Confirm password" 
                        invalid={Boolean(errors.confirmPassword)}
                        errorMessage={errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    type="password"
                                    autoComplete="off"
                                    placeholder="•••••••••"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </>
            )}
        </Card>
    );
};

export default PasswordSection;