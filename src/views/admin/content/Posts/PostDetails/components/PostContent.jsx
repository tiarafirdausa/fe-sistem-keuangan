// src/views/admin/content/Posts/PostDetails/components/PostContent.jsx
import Card from '@/components/ui/Card';

const PostContent = ({ title, featuredImage, content, galleryImages }) => {
    return (
        <Card>
            {title && <h1 className="text-3xl font-bold mb-4">{title}</h1>}
            {featuredImage && (
                <img
                    src={featuredImage}
                    alt={title || 'Featured Image'}
                    className="w-full max-w-xl h-auto max-h-96 object-cover mb-6 rounded-lg shadow-md"
                />
            )}
            {content && (
                <div
                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            )}
            {galleryImages && galleryImages.length > 0 && (
                <div className="mt-8"> 
                    <h2 className="text-2xl font-bold mb-4">Galeri Gambar</h2>
                    {/* Ini adalah parent yang mengatur tata letak galeri */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryImages.map((image, index) => (
                            <div 
                                key={image.id || index} 
                                className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md"
                            >
                                <img
                                    src={image.image_path}
                                    alt={image.alt_text || `Gallery Image ${index + 1}`}
                                    // w-full dan h-full sudah membuat gambar mengisi seluruh ruang div parent
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!title && !featuredImage && !content && (!galleryImages || galleryImages.length === 0) && (
                <p className="text-gray-500">No content or images available for this post.</p>
            )}
        </Card>
    );
};

export default PostContent;