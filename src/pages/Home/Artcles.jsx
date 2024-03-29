import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingIndicator2 from '../../components/LoadingIndicator2/LoadingIndicator2';
import LoadingIndicator1 from '../../components/LoadingIndicator1/LoadingIndicator1';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
function Articles() {
    const [articles, setArticles] = useState([]);
    const pageSize = 2;
    const sortBy = "createdAt";
    const sortDirection = "desc";
    const [isLoading, setIsLoading] = useState(false);
    const [totalArticles, setTotalArticles] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
        fetchArticles(pageNumber);
    }, [pageNumber]);

    const fetchArticles = async (pageToFetch) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}/${apiPrefixV1}/article/web/feed`,
                {
                    params: {
                        "pageSize": pageSize,
                        "sortDirection": sortDirection,
                        "sortBy": sortBy,
                        "pageCount": pageToFetch
                    }
                }
            );
            const code = response.data.code;
            if (code === 2000) {
                if (pageToFetch === 0) {
                    setArticles(response.data.data);
                    setTotalArticles(response.data.data[0].total);
                } else {
                    setArticles([...articles, ...response.data.data]);
                }
            } else {
                toast.error('Failed to fetch data!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className='min-h-screen flex flex-col justify-between'>
            <Header />
            {isLoading ? (
                <div className='flex items-center justify-center h-screen'>
                    <LoadingIndicator2 color='#898989' size={50} />
                </div>
            ) : (
                <>
                    <div className='md:ml-10 ml-5 my-10 '>
                        <p className='p-10p font-semibold text-2xl'>Catch with the latest news in your city</p>
                        <p className='p-10p font-medium italic text-1xl'>Here, you can find the latest developments and work of Municipal</p>
                    </div>
                    {articles && articles.length > 0 && (
                        <div className="flex-grow bg-slate-100 w-[80%] mx-auto my-10px px-10 py-15">
                            <InfiniteScroll
                                dataLength={articles.length}
                                next={() => setPageNumber(pageNumber + 1)}
                                hasMore={articles.length < totalArticles}
                                loader={<LoadingIndicator1 color='#898989' size={25} />}
                                endMessage={
                                    <div className='text-center'>
                                        <p className='text-gray-500 font-bold italic text-1xl'>That's all for now!</p>
                                    </div>
                                }
                                // below props only if you need pull down functionality
                                refreshFunction={() => fetchArticles(0)}
                                pullDownToRefresh={false}
                                pullDownToRefreshThreshold={50}
                                pullDownToRefreshContent={
                                    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                                }
                                releaseToRefreshContent={
                                    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                                }
                            >
                                {articles.map((article, index) => (
                                    <div key={index} className={'flex flex-col md:flex-row items-center py-10 md:justify-around w-full max-w-4xl mx-auto border-b border-gray-200' + (index === articles.length - 1 ? '' : ' mb-10')}>
                                        {/* Render the image or video thumbnail */}
                                        {article.articleMedia && article.articleMedia.length > 0 && (
                                            <div className={'md:mr-5 w-full md:w-[50%] mb-5 md:mb-0'}>
                                                {article.articleMedia[0].mediaType === 'IMAGE' ? (
                                                    <img className='rounded-lg max-w-full h-auto md:h-auto' src={article.articleMedia[0].url} alt={`Image`} />
                                                ) : (
                                                    <img
                                                        className='rounded-lg max-w-full h-auto md:h-auto'
                                                        src={article.articleMedia[0].url.replace('.mp4', '.jpg')}
                                                        alt={`Video Thumbnail`}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <div className={(article.articleMedia.length > 0 ? 'flex flex-col w-full md:w-[50%]' : 'flex flex-col w-full')}>
                                            <h3 className='text-2xl font-semibold'>{article.title}</h3>
                                            <p className='text-1xl font-medium italic'>{formatDate(article.publishDate)}</p>
                                            <p className='text-1xl font-medium line-clamp-6'>{article.description}</p>
                                            {article.description.length > 6 &&
                                                <Link to={`/news/${article.slug}`} className="text-1xl font-medium text-blue-500">Read More</Link>
                                            }
                                            <p className='text-1xl font-medium'>{article.departmentName}</p>
                                        </div>
                                    </div>
                                ))}
                            </InfiniteScroll>
                        </div>
                    )}
                </>
            )}
            <Footer />
        </div>
    );
}

export default Articles;
