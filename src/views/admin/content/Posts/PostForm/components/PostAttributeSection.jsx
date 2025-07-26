// src/views/admin/content/Posts/PostForm/components/PostAttributeSection.jsx
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Tooltip from '@/components/ui/Tooltip';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import DatePicker from '@/components/ui/DatePicker';
import { useEffect, useState } from 'react';
import { apiGetAllCategories } from '@/services/CategoryService';
import { apiGetAllTags } from '@/services/TagService';

const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
];

const PostAttributeSection = ({ control, errors }) => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [categoriesError, setCategoriesError] = useState(null);
    const [tagsData, setTagsData] = useState([]);
    const [tagsError, setTagsError] = useState(null);
    const [localTags, setLocalTags] = useState([]);

    useEffect(() => {
        const fetchAllAttributes = async () => {
            setCategoriesError(null);
            setTagsError(null);

            try {
                const categoriesRes = await apiGetAllCategories();
                if (Array.isArray(categoriesRes)) {
                    setCategoriesData(categoriesRes);
                } else {
                    console.error("Categories data is not an array:", categoriesRes);
                    setCategoriesError(new Error("Invalid categories data format"));
                    setCategoriesData([]);
                }
            } catch (err) {
                console.error("Error fetching categories (useEffect):", err);
                setCategoriesError(err);
                setCategoriesData([]);
            }

            try {
                const tagsRes = await apiGetAllTags();
                if (Array.isArray(tagsRes)) {
                    setTagsData(tagsRes);
                } else {
                    console.error("Tags data is not an array:", tagsRes);
                    setTagsError(new Error("Invalid tags data format"));
                    setTagsData([]);
                }
            } catch (err) {
                console.error("Error fetching tags (useEffect):", err);
                setTagsError(err);
                setTagsData([]);
            }
        };

        fetchAllAttributes();
    }, []);

    useEffect(() => {
        if (tagsData.length > 0) { 
            setLocalTags(tagsData.map(tag => ({ label: tag.name, value: tag.id })));
        }
    }, [tagsData]);


    const categoriesOptions = categoriesData?.map(cat => ({ label: cat.name, value: cat.id })) || [];

    if (categoriesError || tagsError) {
        console.error("Error fetching categories:", categoriesError);
        console.error("Error fetching tags:", tagsError);
        return (
            <Card>
                <h4 className="mb-6">Attributes & Publishing</h4>
                <div className="text-red-500">
                    Failed to load categories or tags. Please try again.
                    {categoriesError && <p>Categories Error: {categoriesError.message}</p>}
                    {tagsError && <p>Tags Error: {tagsError.message}</p>}
                </div>
            </Card>
        );
    }
    
    if (categoriesData.length === 0 && !categoriesError && tagsData.length === 0 && !tagsError) {
        return (
            <Card>
                <h4 className="mb-6">Attributes & Publishing</h4>
                <div>Loading categories and tags...</div>
            </Card>
        );
    }


    return (
        <Card>
            <h4 className="mb-6">Attributes & Publishing</h4>

            <FormItem
                label="Author ID"
                invalid={Boolean(errors.author_id)}
                errorMessage={errors.author_id?.message}
            >
                <Controller
                    name="author_id"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            autoComplete="off"
                            placeholder="Enter Author ID"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || null)}
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
                            placeholder="Select Status"
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Published At (Optional)"
                invalid={Boolean(errors.published_at)}
                errorMessage={errors.published_at?.message}
            >
                <Controller
                    name="published_at"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            inputtable
                            value={field.value ? new Date(field.value) : null}
                            placeholder="Select date"
                            format="YYYY-MM-DD"
                            onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                        />
                    )}
                />
            </FormItem>

            {/* Categories */}
            <FormItem
                label="Categories"
                invalid={Boolean(errors.categories)}
                errorMessage={errors.categories?.message}
            >
                <Controller
                    name="categories"
                    control={control}
                    render={({ field }) => (
                        <Select
                            isMulti
                            isClearable
                            options={categoriesOptions} 
                            value={categoriesOptions.filter(cat => field.value?.includes(cat.value))}
                            placeholder="Select Categories"
                            onChange={(selectedOptions) => {
                                field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
                            }}
                        />
                    )}
                />
            </FormItem>

            {/* Tags */}
            <FormItem
                label="Tags"
                extra={
                    <Tooltip
                        title="You add as many tags as you want to a post"
                        className="text-center"
                    >
                        <HiOutlineQuestionMarkCircle className="text-base mx-1" />
                    </Tooltip>
                }
                invalid={Boolean(errors.tags)}
                errorMessage={errors.tags?.message}
            >
                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <Select
                            isMulti
                            isClearable
                            value={localTags.filter(tag => field.value?.includes(tag.value))}
                            placeholder="Add tags for post..."
                            componentAs={CreatableSelect}
                            options={localTags} 
                            onChange={(selectedOptions) => {
                                const newValues = selectedOptions ? selectedOptions.map(option => {
                                    if (option.__isNew__) {
                                        const tempId = `new-${option.label}`;
                                        setLocalTags(prev => [...prev, { label: option.label, value: tempId }]);
                                        return tempId; 
                                    }
                                    return option.value;
                                }) : [];
                                field.onChange(newValues);
                            }}
                        />
                    )}
                />
            </FormItem>

            <h5 className="mb-2 mt-6">SEO Metadata (Optional)</h5>
            <FormItem
                label="Meta Title"
                invalid={Boolean(errors.meta_title)}
                errorMessage={errors.meta_title?.message}
            >
                <Controller
                    name="meta_title"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="SEO Meta Title"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Meta Description"
                invalid={Boolean(errors.meta_description)}
                errorMessage={errors.meta_description?.message}
            >
                <Controller
                    name="meta_description"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            componentAs="textarea"
                            autoComplete="off"
                            placeholder="SEO Meta Description"
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </Card>
    );
};

export default PostAttributeSection;