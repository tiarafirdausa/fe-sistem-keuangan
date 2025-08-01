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
    const { imgList, onImageDelete, fieldName } = props;

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
                title={`Remove ${fieldName === 'featured_image' ? 'Featured Image' : 'Image'}`}
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this {fieldName === 'featured_image' ? 'featured image' : 'image'}?</p>
            </ConfirmDialog>
        </>
    );
};

const PageImageSection = ({ control, errors, setValue, getValues }) => {

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

    const handleFeaturedImageUpload = (onChange, files) => {
        if (files && files.length > 0) {
            const file = files[0];
            const newImage = {
                id: `featured-${Date.now()}`,
                name: file.name,
                img: URL.createObjectURL(file),
                file: file
            };
            onChange(newImage); 
        }
    };

    const handleFeaturedImageDelete = (onChange) => {
        onChange(null);
        setValue('clear_featured_image', true);
    };

    const handleGalleryImageUpload = (onChange, originalImageList = [], files) => {
        const newImages = files.map((file, index) => ({
            id: `gallery-${Date.now()}-${index}`,
            name: file.name,
            img: URL.createObjectURL(file),
            file: file
        }));
        const updatedList = [...originalImageList, ...newImages];
        onChange(updatedList);
    };

    const handleGalleryImageDelete = (onChange, originalImageList = [], deletedImg) => {
        let imgList = cloneDeep(originalImageList);
        if (deletedImg.id && typeof deletedImg.id === 'number') {
            const currentDeletedIds = getValues('delete_gallery_image_ids') || [];
            setValue('delete_gallery_image_ids', [...currentDeletedIds, deletedImg.id]);
        }

        imgList = imgList.filter((img) => img.id !== deletedImg.id);
        onChange(imgList);
    };

    return (
        <Card>
            <h4 className="mb-6">Images</h4>
            <div className="mb-6">
                <h5 className="mb-2">Featured Image</h5>
                <p className="mb-4 text-xs">
                    This will be the main image for your page. (Formats: .jpg, .jpeg, .png, max 500kb)
                </p>
                <FormItem
                    invalid={Boolean(errors.featured_image)}
                    errorMessage={errors.featured_image?.message}
                >
                    <Controller
                        name="featured_image"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value && field.value.img ? ( 
                                    <div className="grid grid-cols-1 gap-2">
                                        <ImageList
                                            imgList={[field.value]} 
                                            fieldName="featured_image"
                                            onImageDelete={() => handleFeaturedImageDelete(field.onChange)}
                                        />
                                    </div>
                                ) : (
                                    <Upload
                                        draggable
                                        className="min-h-fit"
                                        beforeUpload={beforeUpload}
                                        showList={false}
                                        onChange={(files) => handleFeaturedImageUpload(field.onChange, files)}
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
                                            <div className="text-[60px]">
                                                <PiImagesThin />
                                            </div>
                                            <p className="flex flex-col items-center mt-2">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your featured image here, or{' '}
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

            <div>
                <h5 className="mb-2">Gallery Images</h5>
                <p className="mb-4 text-xs">
                    Add additional images for your page. (Formats: .jpg, .jpeg, .png, max 500kb per image)
                </p>
                <FormItem
                    invalid={Boolean(errors.gallery_images)}
                    errorMessage={errors.gallery_images?.message}
                >
                    <Controller
                        name="gallery_images"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value && field.value.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                        <ImageList
                                            imgList={field.value}
                                            fieldName="gallery_images"
                                            onImageDelete={(img) =>
                                                handleGalleryImageDelete(field.onChange, field.value, img)
                                            }
                                        />
                                        <Upload
                                            draggable
                                            multiple
                                            className="min-h-fit"
                                            beforeUpload={beforeUpload}
                                            showList={false}
                                            onChange={(files) =>
                                                handleGalleryImageUpload(field.onChange, field.value, files)
                                            }
                                        >
                                            <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center min-h-[130px]">
                                                <div className="text-[50px]">
                                                    <HiOutlinePlus />
                                                </div>
                                                <p className="text-center mt-1 text-xs">
                                                    <span className="text-gray-800 dark:text-white">
                                                        Add more images, or{' '}
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
                                            handleGalleryImageUpload(field.onChange, field.value, files)
                                        }
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
                                            <div className="text-[60px]">
                                                <PiImagesThin />
                                            </div>
                                            <p className="flex flex-col items-center mt-2">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your gallery images here, or{' '}
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
                {getValues('gallery_images')?.length > 0 && (
                    <Button
                        className="mt-4"
                        variant="twoTone"
                        color="red-600"
                        type="button"
                        onClick={() => {
                            const currentGalleryImageIds = getValues('gallery_images')
                                .filter(img => typeof img.id === 'number')
                                .map(img => img.id);
                            setValue('clear_gallery_images', true);
                            setValue('delete_gallery_image_ids', currentGalleryImageIds);
                            setValue('gallery_images', []);
                        }}
                    >
                        <HiTrash className="mr-2" /> Clear All Gallery Images
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default PageImageSection;