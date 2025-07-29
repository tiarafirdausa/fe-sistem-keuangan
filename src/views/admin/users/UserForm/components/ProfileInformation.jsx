// src/views/admin/users/UserForm/components/ProfileInformation.jsx
import { Controller } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import Upload from '@/components/ui/Upload';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { FormItem } from '@/components/ui/Form';
import { HiOutlineUser } from 'react-icons/hi';
import { TbPlus } from 'react-icons/tb';
import Card from '@/components/ui/Card';

const ProfileInformation = ({ control, errors, setValue, watch }) => {

    const currentFoto = watch('foto');

    const beforeUpload = (files) => {
        let valid = true;
        const allowedFileType = ['image/jpeg', 'image/png'];
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!';
                }
            }
        }
        return valid;
    };

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
    ];

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
    ];

    const handleFotoUpload = (files) => {
        if (files.length > 0) {
            const file = files[0];
            setValue('foto', {
                name: file.name,
                img: URL.createObjectURL(file),
                file: file,
            });
            setValue('clear_foto', false);
        }
    };

    const handleRemoveFoto = () => {
        setValue('foto', null);
        setValue('clear_foto', true);
    };

    const avatarSrc = currentFoto?.file ? URL.createObjectURL(currentFoto.file) : currentFoto?.img;

    return (
        <Card>
            <h5 className="mb-4">Personal Information</h5>
            <div className="mb-8">
                <Controller
                    name="foto"
                    control={control}
                    render={() => (
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={90}
                                className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                icon={<HiOutlineUser />}
                                src={avatarSrc || ''}
                            />
                            <div className="flex items-center gap-2">
                                <Upload
                                    showList={false}
                                    uploadLimit={1}
                                    beforeUpload={beforeUpload}
                                    onChange={handleFotoUpload}
                                >
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        type="button"
                                        icon={<TbPlus />}
                                    >
                                        Upload Image
                                    </Button>
                                </Upload>
                                {(currentFoto?.img || currentFoto?.file) && (
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={handleRemoveFoto}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                />
            </div>
            <FormItem
                label="Name"
                invalid={Boolean(errors.name)}
                errorMessage={errors.name?.message}
            >
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Full Name"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Username"
                invalid={Boolean(errors.username)}
                errorMessage={errors.username?.message}
            >
                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Username"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            autoComplete="off"
                            placeholder="Email"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Role"
                invalid={Boolean(errors.role)}
                errorMessage={errors.role?.message}
            >
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={roleOptions}
                            value={roleOptions.find(option => option.value === field.value)}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Status"
                invalid={Boolean(errors.status)}
                errorMessage={errors.status?.message}
            >
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={statusOptions}
                            value={statusOptions.find(option => option.value === field.value)}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
        </Card>
    );
};

export default ProfileInformation;