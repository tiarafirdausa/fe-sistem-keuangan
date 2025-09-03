// src/views/page/PageForm/components/PageGeneralSection.jsx

import { useRef } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { VITE_TINYMCE_API_KEY } from '@/constants/app.constant';
import {
    apiUploadTinyMCEImage,
    apiUploadTinyMCEVideo,
} from '@/services/UploadService';

const PageGeneralSection = ({ control, errors }) => {
    const editorRef = useRef(null);
    const handleEditorImageUpload = async (blobInfo) => {
        const file = blobInfo.blob();
        const formData = new FormData();
        formData.append('image', file, blobInfo.filename());

        try {
            const response = await apiUploadTinyMCEImage(formData);
            const location = response?.location;

            if (location) {
                return location;
            } else {
                throw new Error('Image upload failed: No location in response.');
            }
        } catch (error) {
            console.error('TinyMCE image upload failed:', error);
            const errorMessage = error.response?.data?.error || error.message;
            throw new Error(`Image upload failed: ${errorMessage}`);
        }
    };

    const handleEditorVideoUpload = async (blobInfo) => {
        return new Promise((resolve, reject) => {
            const file = blobInfo.blob();
            const formData = new FormData();
            formData.append('video', file, blobInfo.filename());

            apiUploadTinyMCEVideo(formData)
                .then((response) => {
                    const location = response && response.location;
                    if (location) {
                        resolve(location);
                    } else {
                        reject('Video upload failed: No location in response.');
                    }
                })
                .catch((error) => {
                    console.error('TinyMCE video upload failed:', error);
                    const errorMessage =
                        error.response?.data?.error || error.message;
                    reject(`Video upload failed: ${errorMessage}`);
                });
        });
    };

    const handleFilePicker = (callback, value, meta) => {
        if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = async function () {
                const file = this.files[0];
                if (!file) {
                    return;
                }
                const formData = new FormData();
                formData.append('image', file, file.name);

                try {
                    const response = await apiUploadTinyMCEImage(formData);
                    const location = response?.location;

                    if (location) {
                        callback(location, { title: file.name });
                    } else {
                        console.error('Image upload failed: No location in response.');
                    }
                } catch (error) {
                    console.error('TinyMCE file picker image upload failed:', error);
                }
            };
            input.click();
        } else if (meta.filetype === 'media') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'video/*');

            input.onchange = function () {
                const file = this.files[0];
                const formData = new FormData();
                formData.append('video', file, file.name);

                apiUploadTinyMCEVideo(formData)
                    .then((response) => {
                        const location = response?.location;
                        if (location) {
                            callback(location, { title: file.name });
                        } else {
                            console.error('Video upload failed: No location in response.');
                        }
                    })
                    .catch((error) => {
                        console.error('TinyMCE file picker video upload failed:', error);
                    });
            };
            input.click();
        }
    };

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
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'help', 'wordcount',
                                    ],
                                    toolbar:
                                        'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'image media table | ' +
                                        'removeformat | help',
                                    media_dimensions: false,
                                    media_filter_html: false,
                                    content_style:
                                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }' +
                                        'img { max-width: 100%; height: auto; }' +
                                        'iframe, video { display: block; width: 100%; aspect-ratio: 16 / 9; }',
                                    
                                    automatic_uploads: true,
                                    file_picker_types: 'image media',
                                    images_upload_handler: handleEditorImageUpload, // Ganti ke fungsi baru
                                    media_upload_handler: handleEditorVideoUpload,
                                    file_picker_callback: handleFilePicker,
                                    relative_urls: false,
                                    remove_script_host: false,
                                    image_title: true,
                                    extended_valid_elements:
                                        'iframe[src|width|height|name|align|class|frameborder|allowfullscreen]',
                                }}
                                onInit={(evt, editor) => {
                                    editorRef.current = editor;
                                }}
                                onEditorChange={(newValue) => {
                                    field.onChange(newValue);
                                }}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default PageGeneralSection;