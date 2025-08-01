import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import { apiGetPostBySlug } from '@/services/PostService'
import Loading from '@/components/shared/Loading'
import appConfig from '@/configs/app.config'
import PostContent from './components/PostContent'
import PostMeta from './components/PostMeta'

const PostDetails = () => {
    const { slug } = useParams();
    const { data, isLoading, error} = useSWR(
        slug ? `api/posts/${slug}` : null,
        () => apiGetPostBySlug(slug),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    if (isLoading) {
        return <Loading loading={true} />;
    }

    if (error) {
        return <div className="p-4 text-red-600">Failed to load post: {error.message || 'Unknown error occurred.'}</div>;
    }

    if (!data) {
        return <div className="p-4 text-center">Post with slug not found.</div>;
    }

    const authorPhotoUrl = data.author_photo
        ? `${appConfig.backendBaseUrl}${data.author_photo}`
        : null; 

    const featuredImageUrl = data.featured_image
        ? `${appConfig.backendBaseUrl}${data.featured_image}`
        : null;

    const galleryImagesWithUrl = data.gallery_images?.map(image => ({
        ...image,
        image_path: `${appConfig.backendBaseUrl}${image.image_path}`
    })) || [];

    return(
        <Loading loading={isLoading}>
            <>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <PostContent
                            title={data.title}
                            featuredImage={featuredImageUrl}
                            content={data.content}
                            galleryImages={galleryImagesWithUrl}
                        />
                    </div>

                    <div className="lg:w-[320px] xl:w-[420px] gap-4 flex flex-col">
                        <PostMeta
                            authorName={data.author_name}
                            authorPhoto={authorPhotoUrl}
                            publishedAt={data.published_at}
                            categories={data.categories}
                            tags={data.tags}
                        />
                    </div>
                </div>
            </>
        </Loading>
    )

}

export default PostDetails