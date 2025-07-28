// src/views/admin/appearance/Settings/SettingsForm/components/ImageUploadField.jsx
import { useState, useEffect } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { Upload, Avatar, Button } from '@/components/ui';
import { FormItem } from '@/components/ui/Form';
import { MdOutlineBrokenImage } from 'react-icons/md';

const ImageUploadField = ({
    label,
    name,
    currentImageUrl,
    onFileChange,
    onRemove,
    error,
}) => {
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl);

    useEffect(() => {
        setPreviewUrl(currentImageUrl);
    }, [currentImageUrl]);

    const handleUpload = (files) => {
        if (files.length > 0) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onFileChange(name, file);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onRemove(name);
    };

    return (
        <FormItem label={label} invalid={!!error} errorMessage={error}>
            <div className="flex items-center gap-4">
                <Upload
                    className="cursor-pointer"
                    showList={false}
                    onChange={(files) => handleUpload(files)}
                > {/* Moved content between tags */}
                    {
                        previewUrl ? (
                            <Avatar size={80} src={previewUrl} icon={<MdOutlineBrokenImage />} />
                        ) : (
                            <Avatar size={80} icon={<MdOutlineBrokenImage />} />
                        )
                    }
                </Upload> {/* Closing tag */}
                {(previewUrl || currentImageUrl) && (
                    <Button
                        type="button"
                        className="ml-2"
                        variant="twoTone"
                        color="red-600"
                        icon={<HiOutlineTrash />}
                        onClick={handleRemove}
                    >
                        Remove {label}
                    </Button>
                )}
            </div>
        </FormItem>
    );
};

export default ImageUploadField;