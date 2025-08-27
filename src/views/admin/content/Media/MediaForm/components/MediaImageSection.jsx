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
import { makeAspectCrop, centerCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    const pixelRatio = window.devicePixelRatio
    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'))
                    return
                }
                resolve(blob)
            },
            'image/jpeg',
            1,
        )
    })
}

const getVideoThumbnail = (file) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.crossOrigin = 'anonymous'

        video.onloadedmetadata = () => {
            video.currentTime = 0.1
        }

        video.onseeked = () => {
            const canvas = document.createElement('canvas')
            const targetWidth = 410
            const targetHeight = 440

            let sourceWidth = video.videoWidth
            let sourceHeight = video.videoHeight
            let ratio = Math.min(
                targetWidth / sourceWidth,
                targetHeight / sourceHeight,
            )
            let newWidth = sourceWidth * ratio
            let newHeight = sourceHeight * ratio

            canvas.width = targetWidth
            canvas.height = targetHeight
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, targetWidth, targetHeight)
            ctx.drawImage(
                video,
                (targetWidth - newWidth) / 2,
                (targetHeight - newHeight) / 2,
                newWidth,
                newHeight,
            )

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'))
                    return
                }
                const thumbnailFile = new File(
                    [blob],
                    `${file.name.split('.')[0]}.jpeg`,
                    { type: 'image/jpeg' },
                )
                URL.revokeObjectURL(video.src)
                resolve(thumbnailFile)
            }, 'image/jpeg')
        }

        video.onerror = (e) => {
            URL.revokeObjectURL(video.src)
            reject(new Error('Failed to load video metadata: ' + e))
        }
        video.src = URL.createObjectURL(file)
    })
}

const FileList = (props) => {
    const { fileList, onFileDelete } = props
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
                            poster={file.img}
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
                title={`Remove Media`}
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this media file?</p>
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
        const maxFileSize = 5000000
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

    const handleMediaUpload = async (
        onChange,
        originalMediaList = [],
        files,
    ) => {
        const newMediaList = []

        for (const file of files) {
            const isVideo = file.type.startsWith('video/')
            const isImage = file.type.startsWith('image/')
            const currentTotalMedia =
                originalMediaList.length + newMediaList.length

            if (currentTotalMedia < 10) {
                let thumbnailFile = null
                let croppedFile = null

                if (isImage && currentTotalMedia === 0) {
                    try {
                        const img = await new Promise((resolve, reject) => {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                const image = new Image()
                                image.src = e.target.result
                                image.onload = () => resolve(image)
                                image.onerror = reject
                            }
                            reader.readAsDataURL(file)
                        })

                        const crop = centerCrop(
                            makeAspectCrop(
                                {
                                    unit: 'px',
                                    width: 410,
                                    height: 440,
                                },
                                410 / 440,
                                img.width,
                                img.height,
                            ),
                            img.width,
                            img.height,
                        )

                        const croppedImageBlob = await getCroppedImg(img, crop)

                        croppedFile = new File(
                            [croppedImageBlob],
                            `cropped-${file.name}`,
                            {
                                type: 'image/jpeg',
                            },
                        )
                        thumbnailFile = croppedFile
                    } catch (error) {
                        console.error('Error cropping image:', error)
                        thumbnailFile = file 
                    }
                } else if (isVideo) {
                    try {
                        thumbnailFile = await getVideoThumbnail(file)
                    } catch (error) {
                        console.error(
                            'Error generating video thumbnail:',
                            error,
                        )
                        thumbnailFile = file
                    }
                } else {
                    thumbnailFile = file
                }

                newMediaList.push({
                    id: `media-${Date.now()}-${Math.random()}`,
                    name: file.name,
                    img: URL.createObjectURL(thumbnailFile),
                    url: URL.createObjectURL(file),
                    file: file,
                    croppedFile: isImage ? croppedFile : null,
                    videoThumbnail: isVideo ? thumbnailFile : null,
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
            <div>
                <p className="mb-4 text-xs">
                    Add media files (images, videos, audio) for this entry.
                    (Formats: .jpg, .jpeg, .png, .mp4, .mov, .webm, .mp3, max
                    5MB per file)
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
                                        <FileList
                                            fileList={field.value}
                                            onFileDelete={(file) =>
                                                handleMediaDelete(
                                                    field.onChange,
                                                    field.value,
                                                    file,
                                                )
                                            }
                                        />
                                        <Upload
                                            draggable
                                            multiple
                                            className="min-h-fit"
                                            beforeUpload={beforeUpload}
                                            showList={false}
                                            onChange={(files) =>
                                                handleMediaUpload(
                                                    field.onChange,
                                                    field.value,
                                                    files,
                                                )
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
                                            handleMediaUpload(
                                                field.onChange,
                                                field.value,
                                                files,
                                            )
                                        }
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
                                            <div className="text-[60px]">
                                                <PiImagesThin />
                                            </div>
                                            <p className="flex flex-col items-center mt-2">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your media files here,
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