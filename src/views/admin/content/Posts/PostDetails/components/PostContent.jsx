// src/views/admin/content/Posts/PostDetails/components/PostContent.jsx
import Card from '@/components/ui/Card'; 

const PostContent = ({ title, featuredImage, content }) => {
    return (
        <Card>
            {title && <h1 className="text-3xl font-bold mb-4">{title}</h1>}
            {featuredImage && (
                <img
                    src={featuredImage}
                    alt={title || 'Featured Image'}
                    className="w-full h-auto max-h-96 object-cover mb-6 rounded-lg shadow-md"
                />
            )}
            {content && (
                <div
                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            )}
            {!title && !featuredImage && !content && (
                <p className="text-gray-500">No content available for this post.</p>
            )}
        </Card>
    );
};

export default PostContent;