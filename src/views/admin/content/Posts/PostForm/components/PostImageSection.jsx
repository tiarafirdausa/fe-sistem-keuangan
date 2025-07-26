// src/views/admin/content/Posts/PostForm/components/PostImageSection.jsx
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Upload from '@/components/ui/Upload';
import { FormItem } from '@/components/ui/Form';
import Dialog from '@/components/ui/Dialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Controller } from 'react-hook-form';
import { HiEye, HiTrash} from 'react-icons/hi'; 
import { PiImagesThin } from 'react-icons/pi';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';

const getBaseUrl = () => {
    return 'http://localhost:5000'; 
};

const ExistingGalleryImageList = (props) => {
    const { existingImgList, onDeleteConfirmation, onClearAllImages } = props;

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

    const confirmDelete = (img) => {
        setSelectedImg(img);
        setDeleteConfirmationOpen(true);
    };

    const onDeleteConfirmClose = () => {
        setSelectedImg({});
        setDeleteConfirmationOpen(false);
    };

    const onDelete = () => {
        onDeleteConfirmation?.(selectedImg.id); 
        setDeleteConfirmationOpen(false);
    };

    if (!existingImgList || existingImgList.length === 0) {
        return null;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-3">
                <h6 className="text-base font-semibold">Existing Gallery Images</h6>
                <button
                    type="button" 
                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    onClick={onClearAllImages}
                >
                    <HiTrash /> Clear All
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 mb-4">
                {existingImgList.map((img) => (
                    <div
                        key={img.id}
                        className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
                    >
                        <img
                            className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                            src={`${getBaseUrl()}${img.image_path}`} 
                            alt={img.alt_text || `Gallery Image ${img.id}`}
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
                                onClick={() => confirmDelete(img)}
                            >
                                <HiTrash />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <Dialog
                isOpen={viewOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">{selectedImg.alt_text || 'Image'}</h5>
                <img
                    className="w-full"
                    src={`${getBaseUrl()}${selectedImg.image_path}`}
                    alt={selectedImg.alt_text || 'Image'}
                />
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove image"
                onClose={onDeleteConfirmClose}
                onRequestClose={onDeleteConfirmClose}
                onCancel={onDeleteConfirmClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this image from the gallery?</p>
            </ConfirmDialog>
        </>
    );
};


const NewGalleryImageList = (props) => {
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
        onImageDelete?.(selectedImg); // Pass the temporary object for deletion
        setDeleteConfirmationOpen(false);
    };

    if (!imgList || imgList.length === 0) {
        return null;
    }

    return (
        <>
            <h6 className="text-base font-semibold mb-3">Newly Added Gallery Images</h6>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 mb-4">
                {imgList.map((img, index) => (
                    <div
                        key={img.id || `new-img-${index}`} // Use a unique key for new files
                        className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
                    >
                        {/* Displaying file object for new uploads (using URL.createObjectURL) */}
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
            </div>
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
                title="Remove image"
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this newly added image?</p>
            </ConfirmDialog>
        </>
    );
};


const PostImageSection = ({ control, errors, setValue, watch }) => {
    // Watch for existing featured image path and new featured image file
    const existingFeaturedImagePath = watch('existing_featured_image_path');
    const featuredImageFile = watch('featured_image_file');
    const clearFeaturedImage = watch('clear_featured_image');

    // Watch for existing and new gallery images
    const existingGalleryImages = watch('existing_gallery_images');
    const galleryImageFiles = watch('gallery_image_files');
    const deleteGalleryImageIds = watch('delete_gallery_image_ids');

    const beforeUpload = (file) => {
        let valid = true;
        const allowedFileType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Added more types
        const maxFileSize = 2 * 1024 * 1024; // 2MB as per backend Multer config

        if (Array.isArray(file)) { // Check if it's multiple files (for gallery)
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload .jpeg, .png, .gif, or .webp files!';
                    break;
                }
                if (f.size >= maxFileSize) {
                    valid = `File "${f.name}" size cannot exceed 2MB!`;
                    break;
                }
            }
        } else { // Single file (for featured image)
            if (!allowedFileType.includes(file.type)) {
                valid = 'Please upload a .jpeg, .png, .gif, or .webp file!';
            }
            if (file.size >= maxFileSize) {
                valid = 'Featured image size cannot exceed 2MB!';
            }
        }

        if (valid !== true) {
            toast.push(
                <Notification title="Upload Failed" type="danger">
                    {valid}
                </Notification>
            );
        }
        return valid;
    };

    // --- Featured Image Handlers ---
    const handleFeaturedImageUpload = (file) => {
        if (file) {
            setValue('featured_image_file', file[0]); // Multer sends single file as array of 1
            setValue('clear_featured_image', false); // Ensure clear flag is reset
            // If there was an existing image, it will be replaced by the new file on backend
        }
    };

    const handleRemoveFeaturedImage = () => {
        // If there's a new file, just clear that
        if (featuredImageFile) {
            setValue('featured_image_file', null);
        }
        // If there's an existing image (for edit mode), flag it for deletion
        if (existingFeaturedImagePath) {
            setValue('clear_featured_image', true);
        }
    };

    // --- Gallery Image Handlers ---
    const handleGalleryUpload = (files) => {
        if (files && files.length > 0) {
            const currentGalleryFiles = galleryImageFiles || [];
            const newFiles = files.map(file => ({
                id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Unique ID for temporary use
                name: file.name,
                img: URL.createObjectURL(file), // Temporary URL for display
                file: file // Store the actual File object
            }));
            setValue('gallery_image_files', [...currentGalleryFiles, ...newFiles]);
            setValue('clear_all_gallery_images', false); // Ensure this is false if new images are added
        }
    };

    const handleRemoveNewGalleryImage = (deletedImg) => {
        const updatedFiles = (galleryImageFiles || []).filter(img => img.id !== deletedImg.id);
        setValue('gallery_image_files', updatedFiles);
    };

    const handleRemoveExistingGalleryImage = (idToRemove) => {
        const updatedExistingImages = (existingGalleryImages || []).filter(img => img.id !== idToRemove);
        const updatedDeleteIds = [...(deleteGalleryImageIds || []), idToRemove];
        setValue('existing_gallery_images', updatedExistingImages);
        setValue('delete_gallery_image_ids', updatedDeleteIds);
    };

    const handleClearAllExistingGalleryImages = () => {
        if (existingGalleryImages && existingGalleryImages.length > 0) {
            // Confirm with user before clearing all
            const confirmClear = window.confirm("Are you sure you want to remove ALL existing gallery images? This action cannot be undone.");
            if (confirmClear) {
                // Collect all existing IDs to mark for deletion
                const allExistingIds = existingGalleryImages.map(img => img.id);
                setValue('delete_gallery_image_ids', [...(deleteGalleryImageIds || []), ...allExistingIds]);
                setValue('existing_gallery_images', []); // Clear from form state for display
                setValue('clear_all_gallery_images', true); // Flag to backend to delete all
                toast.push(
                    <Notification title="All Gallery Images Marked for Deletion" type="info">
                        All existing gallery images will be removed when you save the post.
                    </Notification>
                );
            }
        }
    };


    // Determine what image to show as featured for display purposes
    const displayFeaturedImage = featuredImageFile 
        ? URL.createObjectURL(featuredImageFile) 
        : (existingFeaturedImagePath && !clearFeaturedImage ? `${getBaseUrl()}${existingFeaturedImagePath}` : null);


    return (
        <Card>
            <h4 className="mb-2">Post Images</h4>
            <p className="mb-4">
                Upload a featured image and additional gallery images for your post.
            </p>

            {/* --- Featured Image Section --- */}
            <h5 className="mb-2">Featured Image (Max 2MB)</h5>
            <FormItem
                invalid={Boolean(errors.featured_image_file || (errors.featured_image_file && featuredImageFile))} // Check for error on file
                errorMessage={errors.featured_image_file?.message}
            >
                <Controller
                    name="featured_image_file" // Controlled by react-hook-form
                    control={control}
                    render={({ field: { ...restField } }) => (
                        <Upload
                            draggable
                            className="h-40" // Adjust height as needed
                            beforeUpload={beforeUpload}
                            showList={false} // We will display it manually
                            onChange={(files) => handleFeaturedImageUpload(files)}
                            onFileRemove={handleRemoveFeaturedImage} // Handle remove
                            {...restField}
                        >
                            {displayFeaturedImage ? (
                                <img
                                    className="max-h-full rounded-lg object-cover"
                                    src={displayFeaturedImage}
                                    alt="Featured Image"
                                />
                            ) : (
                                <div className="text-center">
                                    <div className="text-[50px] text-gray-400 dark:text-gray-600">
                                        <PiImagesThin />
                                    </div>
                                    <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                            Drop your image here, or{' '}
                                        </span>
                                        <span className="text-primary">
                                            Click to browse
                                        </span>
                                    </p>
                                    <p className="mt-1 opacity-60 dark:text-gray-500">
                                        Supports JPG, PNG, GIF, WebP
                                    </p>
                                </div>
                            )}
                        </Upload>
                    )}
                />
            </FormItem>

            {/* --- Gallery Images Section --- */}
            <div className="mt-6">
                <h5 className="mb-2">Gallery Images (Max 10 images, 2MB each)</h5>
                <FormItem
                    invalid={Boolean(errors.gallery_image_files)}
                    errorMessage={errors.gallery_image_files?.message}
                    className="mb-4"
                >
                    <Controller
                        name="gallery_image_files"
                        control={control}
                        render={({ field: {...restField } }) => (
                            <>
                                {/* Display existing gallery images first (from defaultValues when editing) */}
                                <ExistingGalleryImageList
                                    existingImgList={existingGalleryImages}
                                    onDeleteConfirmation={handleRemoveExistingGalleryImage}
                                    onClearAllImages={handleClearAllExistingGalleryImages}
                                />

                                {/* Display newly uploaded gallery images (temporary URLs) */}
                                <NewGalleryImageList
                                    imgList={galleryImageFiles}
                                    onImageDelete={(img) =>
                                        handleRemoveNewGalleryImage(img)
                                    }
                                />

                                <Upload
                                    draggable
                                    multiple // Enable multiple file selection for gallery
                                    className="min-h-fit"
                                    beforeUpload={beforeUpload}
                                    showList={false}
                                    onChange={(files) =>
                                        handleGalleryUpload(files)
                                    }
                                    {...restField}
                                >
                                    <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center min-h-[130px]">
                                        <div className="text-[50px] text-gray-400 dark:text-gray-600">
                                            <PiImagesThin />
                                        </div>
                                        <p className="text-center mt-1 text-xs">
                                            <span className="text-gray-800 dark:text-white">
                                                Drop your images here, or{' '}
                                            </span>
                                            <span className="text-primary">
                                                Click to browse
                                            </span>
                                        </p>
                                    </div>
                                </Upload>
                            </>
                        )}
                    />
                </FormItem>
            </div>
            <p className="text-gray-500 text-sm">
                Image formats: .jpg, .jpeg, .png, .gif, .webp. Max file size per image: 2MB.
            </p>
        </Card>
    );
};

export default PostImageSection;