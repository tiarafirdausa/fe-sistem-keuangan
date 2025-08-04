import { useState } from 'react';
import Card from '@/components/ui/Card';
import Upload from '@/components/ui/Upload';
import { FormItem } from '@/components/ui/Form';
import Dialog from '@/components/ui/Dialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Button from '@/components/ui/Button';
import { Controller } from 'react-hook-form';
import { HiEye, HiTrash, HiOutlinePlus } from 'react-icons/hi';
import cloneDeep from 'lodash/cloneDeep';
import { PiImagesThin } from 'react-icons/pi';

const ImageList = (props) => {
    const { imgList, onImageDelete } = props;

    const [selectedImg, setSelectedImg] = useState({});
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const onViewOpen = (img) => {
        setSelectedImg(img);
        setViewOpen(true);
    };

    const onDialogClose = () => {
        setViewOpen(false);
        setTimeout(() => {
            setSelectedImg({});
        }, 300);
    };

    const onDeleteConfirmation = (img) => {
        setSelectedImg(img);
        setDeleteConfirmationOpen(true);
    };

    const onDeleteConfirmationClose = () => {
        setSelectedImg({});
        setDeleteConfirmationOpen(false);
    };

    const onDelete = () => {
        onImageDelete?.(selectedImg);
        setDeleteConfirmationOpen(false);
    };

    return (
        <>
            {imgList.map((img) => (
                <div
                    key={img.id || img.img}
                    className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
                >
                    <img
                        className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                        src={img.img}
                        alt={img.name}
                    />
                    <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onViewOpen(img)}
                        >
                            <HiEye />
                        </span>
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onDeleteConfirmation(img)}
                        >
                            <HiTrash />
                        </span>
                    </div>
                </div>
            ))}
            <Dialog
                isOpen={viewOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">{selectedImg.name}</h5>
                <img
                    className="w-full"
                    src={selectedImg.img}
                    alt={selectedImg.name}
                />
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title={`Remove Image`}
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this image?</p>
            </ConfirmDialog>
        </>
    );
};

const MediaImageSection = ({ control, errors, setValue, getValues }) => {
    const beforeUpload = (file) => {
        let valid = true;
        const allowedFileType = ['image/jpeg', 'image/png', 'video/mp4', 'audio/mp3'];
        const maxFileSize = 5000000;
        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    return 'Please upload a valid media file (.jpeg, .png, .mp4, or .mp3)!';
                }
                if (f.size >= maxFileSize) {
                    return 'Upload media file cannot be more than 5MB!';
                }
            }
        }
        return valid;
    };

    const handleMediaUpload = (onChange, originalMediaList = [], files) => {
        const newMedia = files.map((file, index) => ({
            id: `media-${Date.now()}-${index}`,
            name: file.name,
            img: URL.createObjectURL(file),
            file: file
        }));
        const updatedList = [...originalMediaList, ...newMedia];
        onChange(updatedList);
    };

    const handleMediaDelete = (onChange, originalMediaList = [], deletedMedia) => {
        let mediaList = cloneDeep(originalMediaList);
        if (deletedMedia.id && typeof deletedMedia.id === 'number') {
            const currentDeletedIds = getValues('delete_media_file_ids') || [];
            setValue('delete_media_file_ids', [...currentDeletedIds, deletedMedia.id]);
        }

        mediaList = mediaList.filter((media) => media.id !== deletedMedia.id);
        onChange(mediaList);
    };

    return (
        <Card>
            <h4 className="mb-6">Media Files</h4>
            <div>
                <p className="mb-4 text-xs">
                    Add media files (images, videos, audio) for this entry. (Formats: .jpg, .jpeg, .png, .mp4, .mp3, max 5MB per file)
                </p>
                <FormItem
                    invalid={Boolean(errors.media)}
                    errorMessage={errors.media?.message}
                >
                    <Controller
                        name="media"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value && field.value.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                        <ImageList
                                            imgList={field.value}
                                            onImageDelete={(img) =>
                                                handleMediaDelete(field.onChange, field.value, img)
                                            }
                                        />
                                        <Upload
                                            draggable
                                            multiple
                                            className="min-h-fit"
                                            beforeUpload={beforeUpload}
                                            showList={false}
                                            onChange={(files) =>
                                                handleMediaUpload(field.onChange, field.value, files)
                                            }
                                        >
                                            <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center min-h-[130px]">
                                                <div className="text-[50px]">
                                                    <HiOutlinePlus />
                                                </div>
                                                <p className="text-center mt-1 text-xs">
                                                    <span className="text-gray-800 dark:text-white">
                                                        Add more media, or{' '}
                                                    </span>
                                                    <span className="text-primary">
                                                        Click to browse
                                                    </span>
                                                </p>
                                            </div>
                                        </Upload>
                                    </div>
                                ) : (
                                    <Upload
                                        draggable
                                        multiple
                                        className="min-h-fit"
                                        beforeUpload={beforeUpload}
                                        showList={false}
                                        onChange={(files) =>
                                            handleMediaUpload(field.onChange, field.value, files)
                                        }
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
                                            <div className="text-[60px]">
                                                <PiImagesThin />
                                            </div>
                                            <p className="flex flex-col items-center mt-2">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your media files here, or{' '}
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
                {getValues('media')?.length > 0 && (
                    <Button
                        className="mt-4"
                        variant="twoTone"
                        color="red-600"
                        type="button"
                        onClick={() => {
                            const currentMediaIds = getValues('media')
                                .filter(file => typeof file.id === 'number')
                                .map(file => file.id);
                            setValue('clear_media_files', true);
                            setValue('delete_media_file_ids', currentMediaIds);
                            setValue('media', []);
                        }}
                    >
                        <HiTrash className="mr-2" /> Clear All Media Files
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default MediaImageSection;