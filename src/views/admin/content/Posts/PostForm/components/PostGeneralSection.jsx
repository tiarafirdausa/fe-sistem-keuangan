// src/views/post/PostForm/components/PostGeneralSection.jsx
import { useRef } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { VITE_TINYMCE_API_KEY } from '@/constants/app.constant';
import { apiUploadTinyMCEImage, apiUploadTinyMCEVideo } from '@/services/UploadService';

const PostGeneralSection = ({ control, errors }) => {
    const editorRef = useRef(null);

    const handleEditorImageUpload = async (blobInfo) => {
        return new Promise((resolve, reject) => {
            const file = blobInfo.blob();
            const formData = new FormData();
            formData.append('image', file, blobInfo.filename());

            apiUploadTinyMCEImage(formData)
                .then((response) => {
                    const location = response && response.location; 
                    if (location) {
                        resolve(location);
                    } else {
                        reject('Image upload failed: No location in response.');
                    }
                })
                .catch((error) => {
                    console.error('TinyMCE image upload failed:', error);
                    const errorMessage = error.response?.data?.error || error.message;
                    reject(`Image upload failed: ${errorMessage}`);
                });
        });
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
                    const errorMessage = error.response?.data?.error || error.message;
                    reject(`Video upload failed: ${errorMessage}`);
                });
        });
    };

    const handleFilePicker = (callback, value, meta) => {
        if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = function() {
                const file = this.files[0];
                const formData = new FormData();
                formData.append('image', file, file.name);

                apiUploadTinyMCEImage(formData)
                    .then(response => {
                        const location = response?.location;
                        if (location) {
                            callback(location, { title: file.name });
                        } else {
                            console.error('Image upload failed: No location in response.');
                        }
                    })
                    .catch(error => {
                        console.error('TinyMCE file picker image upload failed:', error);
                    });
            };
            input.click();
        } else if (meta.filetype === 'media') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'video/*'); 

            input.onchange = function() {
                const file = this.files[0];
                const formData = new FormData();
                formData.append('video', file, file.name);

                apiUploadTinyMCEVideo(formData)
                    .then(response => {
                        const location = response?.location;
                        if (location) {
                            callback(location, { title: file.name });
                        } else {
                            console.error('Video upload failed: No location in response.');
                        }
                    })
                    .catch(error => {
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
                    label="Post Title"
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
                                placeholder="Post Title"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Post Slug"
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
                                placeholder="post-title-slug"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Excerpt"
                    invalid={Boolean(errors.excerpt)}
                    errorMessage={errors.excerpt?.message}
                >
                    <Controller
                        name="excerpt"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="A short summary of the post"
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
                                    content_style:
                                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    
                                    automatic_uploads: true,
                                    file_picker_types: 'image media',
                                    images_upload_handler: handleEditorImageUpload,
                                    media_upload_handler: handleEditorVideoUpload,
                                    
                                    // Callback ini sekarang menangani upload gambar dan media
                                    file_picker_callback: handleFilePicker,

                                    relative_urls: false,
                                    remove_script_host: false,
                                    
                                    image_title: true,
                                    media_filter_html: false,
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

export default PostGeneralSection;