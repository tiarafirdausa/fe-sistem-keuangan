import useSWR from 'swr'
import { useParams } from 'react-router'
import { apiGetPostBySlug } from '@/services/PostService'
import Loading from '@/components/shared/Loading'

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

    return(
        <Loading loading={isLoading}>
            <>
                {/* Bagian ini adalah layout utama untuk konten, meta, dan author */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Kolom kiri untuk konten utama post */}
                    <div className="gap-4 flex flex-col flex-auto">
                        <PostContent
                            title={data.title}
                            featuredImage={data.featured_image}
                            content={data.content}
                        />
                    </div>

                    {/* Kolom kanan untuk informasi meta dan detail penulis */}
                    <div className="lg:w-[320px] xl:w-[420px] gap-4 flex flex-col">
                        <PostMeta
                            authorName={data.author_name}
                            authorPhoto={data.author_photo}
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