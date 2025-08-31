import { useState } from 'react'
import Card from '@/components/ui/Card'
import Upload from '@/components/ui/Upload'
import { FormItem } from '@/components/ui/Form'
import Dialog from '@/components/ui/Dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Button from '@/components/ui/Button'
import { Controller } from 'react-hook-form'
import { HiEye, HiTrash, HiOutlinePlus } from 'react-icons/hi'
import cloneDeep from 'lodash/cloneDeep'
import { PiImagesThin } from 'react-icons/pi'
import getCroppedImg from '@/utils/cropImage' // Make sure to import this

const FileList = (props) => {
    const { fileList, onFileDelete, fieldName } = props
    const [selectedFile, setSelectedFile] = useState({})
    const [viewOpen, setViewOpen] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const onViewOpen = (file) => {
        setSelectedFile(file)
        setViewOpen(true)
    }

    const onDialogClose = () => {
        setViewOpen(false)
        setTimeout(() => {
            setSelectedFile({})
        }, 300)
    }

    const onDeleteConfirmation = (file) => {
        setSelectedFile(file)
        setDeleteConfirmationOpen(true)
    }

    const onDeleteConfirmationClose = () => {
        setSelectedFile({})
        setDeleteConfirmationOpen(false)
    }

    const onDelete = () => {
        onFileDelete?.(selectedFile)
        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            {fileList.map((file) => (
                <div
                    key={file.id || file.url || file.img}
                    className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
                >
                    {file.isVideo ? (
                        <video
                            controls
                            className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                            src={file.url}
                        >
                            Browser Anda tidak mendukung tag video.
                        </video>
                    ) : (
                        <img
                            className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                            src={file.url}
                            alt={file.name}
                        />
                    )}
                    <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center">
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onViewOpen(file)}
                        >
                            <HiEye />
                        </span>
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onDeleteConfirmation(file)}
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
                <h5 className="mb-4">{selectedFile.name}</h5>
                {selectedFile.isVideo ? (
                    <video
                        controls
                        className="w-full"
                        src={selectedFile.url}
                        alt={selectedFile.name}
                    />
                ) : (
                    <img
                        className="w-full"
                        src={selectedFile.url}
                        alt={selectedFile.name}
                    />
                )}
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title={`Remove ${fieldName === 'featured_image' ? 'Featured Image' : 'Media File'}`}
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this {fieldName === 'featured_image' ? 'featured image' : 'media file'}?</p>
            </ConfirmDialog>
        </>
    )
}

const MediaImageSection = ({ control, errors, setValue, getValues }) => {
    const beforeUpload = (file) => {
        let valid = true
        const allowedFileType = [
            'image/jpeg',
            'image/png',
            'video/mp4',
            'audio/mp3',
            'video/quicktime',
            'video/webm',
        ]
        const maxFileSize = 5000000 // 5MB
        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    return 'Please upload a valid media file (.jpeg, .png, .mp4, .mov, .webm, or .mp3)!'
                }
                if (f.size >= maxFileSize) {
                    return 'Upload media file cannot be more than 5MB!'
                }
            }
        }
        return valid
    }

    const beforeFeaturedImageUpload = (file) => {
        let valid = true
        const allowedFileType = ['image/jpeg', 'image/png']
        const maxFileSize = 500000 // 500kb
        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    return 'Please upload a .jpeg or .png file!'
                }
                if (f.size >= maxFileSize) {
                    return 'Upload image cannot be more than 500kb!'
                }
            }
        }
        return valid
    }

    // Function to handle featured image upload
    const handleFeaturedImageUpload = async (files, onChange) => {
        if (!files || files.length === 0) return
        const file = files[0]
        const imageSrc = URL.createObjectURL(file)

        // Set target dimensions for the featured image
        const targetWidth = 410
        const targetHeight = 440

        try {
            const image = await new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = () => resolve(img)
                img.onerror = reject
                img.src = imageSrc
            })

            const originalWidth = image.naturalWidth
            const originalHeight = image.naturalHeight

            const aspectRatio = targetWidth / targetHeight
            let newWidth = originalWidth
            let newHeight = originalHeight
            let startX = 0
            let startY = 0

            if (originalWidth / originalHeight > aspectRatio) {
                // Image is wider than the target aspect ratio
                newWidth = originalHeight * aspectRatio
                startX = (originalWidth - newWidth) / 2
            } else {
                // Image is taller than the target aspect ratio
                newHeight = originalWidth / aspectRatio
                startY = (originalHeight - newHeight) / 2
            }

            const pixelCrop = {
                x: startX,
                y: startY,
                width: newWidth,
                height: newHeight,
            }

            const croppedImageBlob = await getCroppedImg(imageSrc, pixelCrop)
            const croppedFile = new File([croppedImageBlob], file.name, {
                type: croppedImageBlob.type,
            })

            const newImage = {
                id: `featured-${Date.now()}`,
                name: file.name,
                url: URL.createObjectURL(croppedFile),
                file: croppedFile,
            }
            onChange(newImage)
        } catch (error) {
            console.error('Failed to crop the featured image:', error)
            URL.revokeObjectURL(imageSrc)
        }
    }

    // Function to handle featured image deletion
    const handleFeaturedImageDelete = (onChange, deletedFile) => {
        if (deletedFile && deletedFile.url) {
            URL.revokeObjectURL(deletedFile.url)
        }
        onChange(null)
    }

    const handleMediaUpload = async (
        onChange,
        originalMediaList = [],
        files,
    ) => {
        const newMediaList = []
        for (const file of files) {
            const isVideo = file.type.startsWith('video/')
            const currentTotalMedia =
                originalMediaList.length + newMediaList.length

            if (currentTotalMedia < 10) {
                newMediaList.push({
                    id: `media-${Date.now()}-${Math.random()}`,
                    name: file.name,
                    url: URL.createObjectURL(file),
                    file: file,
                    isVideo: isVideo,
                })
            }
        }
        onChange([...originalMediaList, ...newMediaList])
    }

    const handleMediaDelete = (
        onChange,
        originalMediaList = [],
        deletedMedia,
    ) => {
        let mediaList = cloneDeep(originalMediaList)
        if (deletedMedia.url) {
            URL.revokeObjectURL(deletedMedia.url)
        }
        if (deletedMedia.id && typeof deletedMedia.id === 'number') {
            const currentDeletedIds = getValues('delete_media_file_ids') || []
            setValue('delete_media_file_ids', [
                ...currentDeletedIds,
                deletedMedia.id,
            ])
        }
        mediaList = mediaList.filter((media) => media.id !== deletedMedia.id)
        onChange(mediaList)
    }

    return (
        <Card>
            <h4 className="mb-6">Media Files</h4>

            {/* Featured Image Section */}
            <div className="mb-6">
                <h5 className="mb-2">Featured Image</h5>
                <p className="mb-4 text-xs">
                    This will be the main image for your page. (Formats: .jpg, .jpeg, .png, max 500kb, will be automatically cropped to 410x440)
                </p>
                <FormItem invalid={Boolean(errors.featured_image)} errorMessage={errors.featured_image?.message}>
                    <Controller
                        name="featured_image"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value && field.value.url ? (
                                    <div className="grid grid-cols-1 gap-2">
                                        <FileList
                                            fileList={[field.value]}
                                            fieldName="featured_image"
                                            onFileDelete={(file) => handleFeaturedImageDelete(field.onChange, file)}
                                        />
                                    </div>
                                ) : (
                                    <Upload
                                        draggable
                                        className="min-h-fit"
                                        beforeUpload={beforeFeaturedImageUpload}
                                        showList={false}
                                        onChange={(files) => handleFeaturedImageUpload(files, field.onChange)}
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

            {/* General Media Files Section */}
            <div>
                <h5 className="mb-2">Gallery Media</h5>
                <p className="mb-4 text-xs">
                    Add additional media files for your page. (Formats: .jpg, .jpeg, .png, .mp4, .mov, .webm, .mp3, max 5MB per file)
                </p>
                <FormItem invalid={Boolean(errors.media)} errorMessage={errors.media?.message}>
                    <Controller
                        name="media"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value && field.value.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                        <FileList
                                            fileList={field.value}
                                            onFileDelete={(file) =>
                                                handleMediaDelete(field.onChange, field.value, file)
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
                                .filter((file) => typeof file.id === 'number')
                                .map((file) => file.id)
                            setValue('clear_media_files', true)
                            setValue('delete_media_file_ids', currentMediaIds)
                            setValue('media', [])
                        }}
                    >
                        <HiTrash className="mr-2" /> Clear All Media Files
                    </Button>
                )}
            </div>
        </Card>
    )
}

export default MediaImageSection