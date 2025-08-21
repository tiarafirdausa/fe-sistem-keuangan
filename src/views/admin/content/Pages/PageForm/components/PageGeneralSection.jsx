import { useRef } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { Editor } from '@tinymce/tinymce-react'
import { VITE_TINYMCE_API_KEY } from '@/constants/app.constant'
import {
    apiUploadTinyMCEImage,
    apiUploadTinyMCEVideo,
} from '@/services/UploadService'
import getCroppedImg from '@/utils/cropImage'

const PageGeneralSection = ({ control, errors }) => {
    const editorRef = useRef(null)

    const handleEditorImageUploadAndCrop = async (blobInfo) => {
        const file = blobInfo.blob()
        const imageSrc = URL.createObjectURL(file)

        const targetWidth = 560
        const targetHeight = 350
        const aspectRatio = targetWidth / targetHeight

        try {
            const image = await new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = () => resolve(img)
                img.onerror = reject
                img.src = imageSrc
            })

            const originalWidth = image.naturalWidth
            const originalHeight = image.naturalHeight

            let newWidth = originalWidth
            let newHeight = originalHeight
            let startX = 0
            let startY = 0

            if (originalWidth / originalHeight > aspectRatio) {
                newWidth = originalHeight * aspectRatio
                startX = (originalWidth - newWidth) / 2
            } else {
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
            const croppedFile = new File(
                [croppedImageBlob],
                blobInfo.filename(),
                { type: croppedImageBlob.type },
            )

            const formData = new FormData()
            formData.append('image', croppedFile, blobInfo.filename())

            const response = await apiUploadTinyMCEImage(formData)
            const location = response?.location

            if (location) {
                URL.revokeObjectURL(imageSrc)
                return location
            } else {
                URL.revokeObjectURL(imageSrc)
                throw new Error('Image upload failed: No location in response.')
            }
        } catch (error) {
            URL.revokeObjectURL(imageSrc)
            console.error('TinyMCE image upload and crop failed:', error)
            const errorMessage = error.response?.data?.error || error.message
            throw new Error(`Image upload failed: ${errorMessage}`)
        }
    }

    const handleEditorVideoUpload = async (blobInfo) => {
        return new Promise((resolve, reject) => {
            const file = blobInfo.blob()
            const formData = new FormData()
            formData.append('video', file, blobInfo.filename())

            apiUploadTinyMCEVideo(formData)
                .then((response) => {
                    const location = response && response.location
                    if (location) {
                        resolve(location)
                    } else {
                        reject('Video upload failed: No location in response.')
                    }
                })
                .catch((error) => {
                    console.error('TinyMCE video upload failed:', error)
                    const errorMessage =
                        error.response?.data?.error || error.message
                    reject(`Video upload failed: ${errorMessage}`)
                })
        })
    }

    const handleFilePicker = (callback, value, meta) => {
        if (meta.filetype === 'image') {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')

            input.onchange = async function () {
                const file = this.files[0]
                if (!file) {
                    return
                }

                const imageSrc = URL.createObjectURL(file)
                const targetWidth = 560
                const targetHeight = 350
                const aspectRatio = targetWidth / targetHeight

                try {
                    const image = await new Promise((resolve, reject) => {
                        const img = new Image()
                        img.onload = () => resolve(img)
                        img.onerror = reject
                        img.src = imageSrc
                    })

                    const originalWidth = image.naturalWidth
                    const originalHeight = image.naturalHeight

                    let newWidth = originalWidth
                    let newHeight = originalHeight
                    let startX = 0
                    let startY = 0

                    if (originalWidth / originalHeight > aspectRatio) {
                        newWidth = originalHeight * aspectRatio
                        startX = (originalWidth - newWidth) / 2
                    } else {
                        newHeight = originalWidth / aspectRatio
                        startY = (originalHeight - newHeight) / 2
                    }

                    const pixelCrop = {
                        x: startX,
                        y: startY,
                        width: newWidth,
                        height: newHeight,
                    }

                    const croppedImageBlob = await getCroppedImg(
                        imageSrc,
                        pixelCrop,
                    )
                    const croppedFile = new File(
                        [croppedImageBlob],
                        file.name,
                        { type: croppedImageBlob.type },
                    )

                    const formData = new FormData()
                    formData.append('image', croppedFile, file.name)

                    const response = await apiUploadTinyMCEImage(formData)
                    const location = response?.location

                    if (location) {
                        callback(location, { title: file.name })
                    } else {
                        console.error(
                            'Image upload failed: No location in response.',
                        )
                    }
                } catch (error) {
                    console.error(
                        'TinyMCE file picker image upload failed:',
                        error,
                    )
                } finally {
                    URL.revokeObjectURL(imageSrc)
                }
            }
            input.click()
        } else if (meta.filetype === 'media') {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'video/*')

            input.onchange = function () {
                const file = this.files[0]
                const formData = new FormData()
                formData.append('video', file, file.name)

                apiUploadTinyMCEVideo(formData)
                    .then((response) => {
                        const location = response?.location
                        if (location) {
                            callback(location, { title: file.name })
                        } else {
                            console.error(
                                'Video upload failed: No location in response.',
                            )
                        }
                    })
                    .catch((error) => {
                        console.error(
                            'TinyMCE file picker video upload failed:',
                            error,
                        )
                    })
            }
            input.click()
        }
    }

    return (
        <Card>
            <h4 className="mb-6">General Information</h4>
            <div className="flex flex-col gap-4">
                <FormItem
                    label="Page Title"
                    invalid={Boolean(errors.title)}
                    errorMessage={errors.title?.message}
                >
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Page Title"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Page Slug"
                    invalid={Boolean(errors.slug)}
                    errorMessage={errors.slug?.message}
                >
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="page-title-slug"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Content"
                    invalid={Boolean(errors.content)}
                    errorMessage={errors.content?.message}
                >
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <Editor
                                apiKey={VITE_TINYMCE_API_KEY}
                                value={field.value}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist',
                                        'autolink',
                                        'lists',
                                        'link',
                                        'image',
                                        'charmap',
                                        'preview',
                                        'anchor',
                                        'searchreplace',
                                        'visualblocks',
                                        'code',
                                        'fullscreen',
                                        'insertdatetime',
                                        'media',
                                        'table',
                                        'help',
                                        'wordcount',
                                    ],
                                    toolbar:
                                        'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'image media table | ' +
                                        'removeformat | help',
                                    content_style:
                                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }' +
                                        'img, iframe, video { width: 100%; height: auto; aspect-ratio: 560 / 350; }',
                                    automatic_uploads: true,
                                    file_picker_types: 'image media',
                                    images_upload_handler:
                                        handleEditorImageUploadAndCrop, // Ganti fungsi lama
                                    media_upload_handler:
                                        handleEditorVideoUpload,
                                    file_picker_callback: handleFilePicker,
                                    relative_urls: false,
                                    remove_script_host: false,
                                    image_title: true,
                                    media_filter_html: false,
                                    extended_valid_elements:
                                        'iframe[src|width|height|name|align|class|frameborder|allowfullscreen]',
                                }}
                                onInit={(evt, editor) => {
                                    editorRef.current = editor
                                }}
                                onEditorChange={(newValue) => {
                                    field.onChange(newValue)
                                }}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default PageGeneralSection
