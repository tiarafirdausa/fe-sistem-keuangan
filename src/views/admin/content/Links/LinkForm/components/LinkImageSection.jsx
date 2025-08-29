import { useState } from 'react';
import Card from '@/components/ui/Card';
import Upload from '@/components/ui/Upload';
import { FormItem } from '@/components/ui/Form';
import Dialog from '@/components/ui/Dialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Controller } from 'react-hook-form';
import { HiEye, HiTrash } from 'react-icons/hi';
import { PiImagesThin } from 'react-icons/pi';

const ImageDisplay = (props) => {
    const { img, onImageDelete } = props;

    const [viewOpen, setViewOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const onViewOpen = () => {
        setViewOpen(true);
    };

    const onDialogClose = () => {
        setViewOpen(false);
    };

    const onDeleteConfirmation = () => {
        setDeleteConfirmationOpen(true);
    };

    const onDeleteConfirmationClose = () => {
        setDeleteConfirmationOpen(false);
    };

    const onDelete = () => {
        onImageDelete?.();
        setDeleteConfirmationOpen(false);
    };

    return (
        <>
            <div className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex">
                <img
                    className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                    src={img.img}
                    alt={img.name}
                />
                <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
                    <span
                        className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                        onClick={onViewOpen}
                    >
                        <HiEye />
                    </span>
                    <span
                        className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                        onClick={onDeleteConfirmation}
                    >
                        <HiTrash />
                    </span>
                </div>
            </div>
            <Dialog
                isOpen={viewOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">{img.name}</h5>
                <img className="w-full" src={img.img} alt={img.name} />
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Link Image"
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this link image?</p>
            </ConfirmDialog>
        </>
    );
};

const LinkImageSection = ({ control, errors, setValue, getValues }) => {
    const beforeUpload = (file) => {
        let valid = true;
        const allowedFileType = ['image/jpeg', 'image/png'];
        const maxFileSize = 500000;

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    return 'Please upload a .jpeg or .png file!';
                }
                if (f.size >= maxFileSize) {
                    return 'Upload image cannot be more than 500kb!';
                }
            }
        }
        return valid;
    };

    const handleLinkImageUpload = (files) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        const newImage = {
            id: `link-image-${Date.now()}`,
            name: file.name,
            img: URL.createObjectURL(file),
            file: file,
        };
        setValue('gambar', newImage);
    };

    const handleLinkImageDelete = () => {
        const currentImage = getValues('gambar');
        if (currentImage && currentImage.img) {
            URL.revokeObjectURL(currentImage.img);
        }
        setValue('gambar', null);
        setValue('clear_gambar', true);
    };

    return (
        <Card>
            <h4 className="mb-6">Link Image</h4>
            <div className="mb-6">
                <p className="mb-4 text-xs">
                    This will be the main image for your link. (Formats: .jpg,
                    .jpeg, .png, max 500kb)
                </p>
                <FormItem
                    invalid={Boolean(errors.gambar)}
                    errorMessage={errors.gambar?.message}
                >
                    <Controller
                        name="gambar"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value && field.value.img ? (
                                    <div className="grid grid-cols-1 gap-2">
                                        <ImageDisplay
                                            img={field.value}
                                            onImageDelete={handleLinkImageDelete}
                                        />
                                    </div>
                                ) : (
                                    <Upload
                                        draggable
                                        className="min-h-fit"
                                        beforeUpload={beforeUpload}
                                        showList={false}
                                        onChange={handleLinkImageUpload}
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
                                            <div className="text-[60px]">
                                                <PiImagesThin />
                                            </div>
                                            <p className="flex flex-col items-center mt-2">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your link image here,
                                                    or{' '}
                                                </span>
                                                <span className="text-primary">
                                                    Click to browse
                                                </span>
                                            </p>
                                        </div>
                                    </Upload>
                                )}
                            </>
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default LinkImageSection;