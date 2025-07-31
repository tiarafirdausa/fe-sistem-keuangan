// src/views/post/PostForm/components/PostDetailsSection.jsx
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import Input from '@/components/ui/Input'; 
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';

const PostDetailsSection = ({ control, errors, currentUser, postAuthorNameForDisplay }) => {
    const statusOptions = [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
    ];

    const displayedAuthorName = postAuthorNameForDisplay || currentUser?.name || 'Memuat Penulis...';

    return (
        <Card>
            <h4 className="mb-6">Detail Post</h4>
            <div className="flex flex-col gap-4">
                <FormItem
                    label="Penulis" 
                    invalid={Boolean(errors.author_id)}
                    errorMessage={errors.author_id?.message}
                >
                    <Controller
                        name="author_id"
                        control={control}
                        render={() => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Nama Penulis"
                                value={displayedAuthorName} 
                                disabled={true} 
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Status"
                    invalid={Boolean(errors.status)}
                    errorMessage={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={statusOptions}
                                value={statusOptions.find(option => option.value === field.value)}
                                placeholder="Pilih Status"
                                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Diterbitkan Pada"
                    invalid={Boolean(errors.published_at)}
                    errorMessage={errors.published_at?.message}
                >
                    <Controller
                        name="published_at"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value ? new Date(field.value) : null}
                                placeholder="Pilih Tanggal Publikasi"
                                enableCloseOnSelect={true}
                                onChange={(date) => field.onChange(date)}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    );
};

export default PostDetailsSection;