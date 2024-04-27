import  { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingIndicator2 from '../../components/LoadingIndicator2/LoadingIndicator2';
import LoadingIndicator1 from '../../components/LoadingIndicator1/LoadingIndicator1';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
function Notices() {
    const [notices, setNotices] = useState([]);
    const pageSize = 20;
    const sortBy = "createdAt";
    const sortDirection = "desc";
    const [isLoading, setIsLoading] = useState(false);
    const [totalNotices, setTotalNotices] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        fetchNotices(pageNumber);
    }, [pageNumber]);

    const fetchNotices = async (pageToFetch) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}/${apiPrefixV1}/alert/web/feed`,
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
                    setNotices(response.data.data);
                    setTotalNotices(response.data.data[0].total);
                } else {
                    setNotices([...notices, ...response.data.data]);
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

    const openDocument = (url) => {
        window.open(url, '_blank');
    }

    if (isLoading) {
        return <div className="loading"><LoadingIndicator2 color="#36d7b7" size={50} /></div>
    }


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
                    {notices && notices.length > 0 && (
                        <div className="flex-grow w-[99%] mx-auto my-10px px-1 py-15">
                            <InfiniteScroll
                                dataLength={notices.length}
                                next={() => setPageNumber(pageNumber + 1)}
                                hasMore={notices.length < totalNotices}
                                loader={<LoadingIndicator1 color='#898989' size={25} />}
                                endMessage={
                                    <div className='text-center'>
                                        <p className='text-gray-500 font-bold italic text-1xl'>That&apos;s all or now!</p>
                                    </div>
                                }
                                refreshFunction={() => fetchNotices(0)}
                                pullDownToRefresh={false}
                                pullDownToRefreshThreshold={50}
                                pullDownToRefreshContent={
                                    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                                }
                                releaseToRefreshContent={
                                    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                                }
                            >
                                {
                                    notices.length === 0 && <div className="flex-grow  w-[80%]
                                    text-center mx-auto my-10px px-10 py-15">
                                        <p className='text-gray-500 font-bold italic text-1xl'>No articles found!</p>
                                    </div>
                                }

                                {
                                    notices.length > 0 && <div className="flex-grow  w-[80%] mx-auto my-10px px-10 py-15">
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr>
                                                    <th className="border border-gray-300 py-2 px-4">Subject</th>
                                                    <th className="border border-gray-300 py-2 px-4">Published On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notices.map((notice, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                                        <td className="border hover:underline border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                            if (notice.alertInputType === "DOCUMENT") {
                                                                openDocument(notice['alertDocuments'][0]['documentUrl']);
                                                            } else {
                                                                navigate(`/notices/${notice['alertToken']}`)
                                                            }
                                                        }}>
                                                            {notice.subject}
                                                        </td>
                                                        <td className="border border-gray-300 py-2 px-4">{formatDate(notice.publishedOn)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                }

                            </InfiniteScroll>
                        </div>
                    )}
                </>
            )}
            <Footer />
        </div>
    );
}

export default Notices;
