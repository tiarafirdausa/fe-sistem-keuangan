// src/views/admin/content/Posts/PostDetails/components/PostMeta.jsx
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import dayjs from 'dayjs';
import Avatar from '@/components/ui/Avatar';

const PostMeta = ({ authorName, authorPhoto, publishedAt, categories, tags }) => {
    const displayDate =
        publishedAt && typeof publishedAt === 'string' && publishedAt.trim() !== ''
            ? dayjs(publishedAt) 
            : null;

    return (
        <Card>
            <h4 className="mb-4">Post Information</h4>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3"> 
                    {authorPhoto && <Avatar shape="circle" src={authorPhoto} size={30} />} 
                    <p>
                        <span className="font-semibold">Author:</span> {authorName || 'N/A'}
                    </p>
                </div>
                <p>
                    <span className="font-semibold">Published At:</span>{' '}
                    {displayDate && displayDate.isValid() ? displayDate.format('DD MMMM YYYY, HH:mm') : 'N/A'}
                </p>

                {categories && categories.length > 0 && (
                    <div>
                        <span className="font-semibold">Categories:</span>{' '}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {categories.map((cat) => (
                                <Tag key={cat.id || cat.name} className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100">
                                    {cat.name}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}

                {tags && tags.length > 0 && (
                    <div>
                        <span className="font-semibold">Tags:</span>{' '}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <Tag key={tag.id || tag.name} className="bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100">
                                    {tag.name}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PostMeta;