import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import Slider from 'react-slick';
import LazyLoad from 'react-lazy-load';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingIndicator2 from '../../components/LoadingIndicator2/LoadingIndicator2';

function NewsArticleContentMobile() {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [articleData, setArticleData] = useState(null);
    const fetchArticleDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}/${apiPrefixV1}/article?slug=${slug}`,
            );
            const code = response.data.code;
            if (code === 2000) {
                setArticleData(response.data.data);
            } else {
            }
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticleDetails();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isLoading) {
        return <div className="w-screen h-screen justify-center items-center flex-row"><LoadingIndicator2 color="#00796b" size={30} /></div>
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow mx-auto p-4 max-w-4xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold my-4">{articleData ? articleData.title : ''}</h1>
                    <div className="text-gray-600 mb-4">{articleData ? articleData.departmentName : ''} | Date: {articleData ? formatDate(articleData.publishDate) : ''}</div>
                </div>
                <div className="mb-8">
                    {articleData && (
                        <Slider {...sliderSettings}>
                            {articleData.articleMedia.map(media => (
                                <div key={media.mediaToken}>
                                    <LazyLoad height={300}>
                                        {media.mediaType === 'VIDEO' ? (
                                            <video className="h-full w-auto mx-auto object-contain" controls>
                                                <source src={media.url} type={media.format} />
                                            </video>
                                        ) : (
                                            <img className="h-full w-auto mx-auto object-contain" src={media.url} alt={media.fileName} />
                                        )}
                                    </LazyLoad>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
                <div className='border-b-2 italic text-justify text-gray-700 border-slate-400'>{articleData?.description}</div>
                <div className="article-content" dangerouslySetInnerHTML={{ __html: articleData?.content }} />
            </div>
        </div>
    );
}

const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
};

export default NewsArticleContentMobile;
