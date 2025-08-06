// src/views/PageDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Loading from "@/components/shared/Loading";
import { apiGetPageBySlug } from '@/services/PageService'; 

export default function PageDetail() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasError(false);
    setPageData(null);

    const fetchPage = async () => {
      if (!slug) {
        setLoading(false);
        setHasError(true);
        return;
      }

      try {
        const response = await apiGetPageBySlug(slug);
        if (response) {
          const fetchedPage = {
            title: response.title,
            description: response.meta_description, 
            heroImage: response.featured_image,
            content: response.content,
          };
          setPageData(fetchedPage);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return <Loading loading={true} />;
  }

  if (hasError || !pageData) {
    return (
      <div className="flex flex-auto flex-col h-[100vh] justify-center items-center">
        <h1 className="text-3xl font-bold">404 - Halaman Tidak Ditemukan</h1>
        <p className="mt-4">Maaf, halaman yang Anda cari tidak ada.</p>
      </div>
    );
  }

  return (
    <div className="grow shrink-0">
      {/* Hero Section */}
      <section className="wrapper">
        <div className="container pt-10 xl:pt-[4.5rem] lg:pt-[4.5rem] md:pt-[4.5rem] !text-center">
          <div className="flex flex-wrap mx-[-15px]">
            <div className="xl:w-6/12 flex-[0_0_auto] !px-[15px] max-w-full !mx-auto">
              <h1 className="!text-[calc(1.365rem_+_1.38vw)] font-bold !leading-[1.2] xl:!text-[2.4rem] !mb-4">
                {pageData.title}
              </h1>
              <p className="lead text-[1.05rem] !leading-[1.6] font-medium !mb-0">
                {pageData.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}