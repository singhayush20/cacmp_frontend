import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator1 from '../../LoadingIndicator1/LoadingIndicator1';
import LoadingIndicator2 from '../../LoadingIndicator2/LoadingIndicator2';
function UserQueries() {
    const userData = useSelector(state => state.auth.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userQueries, setUserQueries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 2;
    const sortBy = "createdAt";
    const sortDirection = "desc";
    const [pageNumber, setPageNumber] = useState(0);
    const [totalQueries, setTotalQueries] = useState(0);
    useEffect(() => {
        fetchData(pageNumber)
    }, [pageNumber])

    const fetchData = async (pageNumber, isloadingMore = false) => {

        if (!isloadingMore) {
            setIsLoading(true);
        }
        try {
            const detailsResponse = await axios.get(`${baseUrl}/${apiPrefixV1}/query/all`, {
                params: {
                    "pageSize": pageSize,
                    "pageCount": pageNumber,
                    "sortDirection": sortDirection,
                    "sortBy": sortBy
                },
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`,
                },
            });
            console.log(detailsResponse.data);
            if (detailsResponse.data.code === 2000) {
                setUserQueries(detailsResponse.data.data);
                if (detailsResponse.data.data.length > 0) {
                    setTotalQueries(detailsResponse.data.data[0].count);
                }
            } else if (detailsResponse.data.code === 2003) {
                console.log('Token expired!');
                navigate('/admin/dashboard');
                dispatch(logout());
                toast.info('Login again!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            } else {
                toast.error('Failed to load data!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            console.log(error.message)
            toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async (queryToken, index) => {
        try {
            const response = await axios.delete(`${baseUrl}/${apiPrefixV1}/query/${queryToken}`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            })
            if (response.data.code === 2000) {
                setTotalQueries(totalQueries - 1);
                setUserQueries(prevQueries => {
                    const updatedQueries = [...prevQueries];
                    updatedQueries.splice(index, 1);
                    return updatedQueries;
                });
                toast.success('Query deleted successfully!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        }
        catch (err) {
            toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            console.log(err);
        }
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        console.log(date);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isLoading) {
        return <div className='flex items-center justify-center h-screen'>
            <LoadingIndicator2 color='#269767' size={50} />
        </div>
    }

    if (userQueries && userQueries.length > 0) {
        return (

            <div className="flex-grow w-full mx-auto my-10px px-10 py-15">
                <InfiniteScroll
                    dataLength={userQueries.length}
                    next={() => setPageNumber(pageNumber + 1)}
                    hasMore={userQueries.length < totalQueries}
                    loader={<LoadingIndicator1 color='#898989' size={25} />}
                    endMessage={
                        <div className='text-center'>
                            <p className='text-gray-500 font-bold italic text-1xl'>That's all for now!</p>
                        </div>
                    }
                    refreshFunction={() => fetchData(0)}
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
                        userQueries.length === 0 && <div className="flex-grow  w-[80%]
                                    text-center mx-auto my-10px px-10 py-15">
                            <p className='text-gray-500 font-bold italic text-1xl'>No articles found!</p>
                        </div>
                    }

                    {
                        userQueries.length > 0 && <div className=" w-100  my-10px  py-15">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 py-2 px-4">Name</th>
                                        <th className="border border-gray-300 py-2 px-4">Email</th>
                                        <th className="border border-gray-300 py-2 px-4">Phone</th>
                                        <th className="border border-gray-300 py-2 px-4">Message</th>
                                        <th className="border border-gray-300 py-2 px-4">Message</th>
                                        <th className="border border-gray-300 py-2 px-4">Date</th>
                                        <th className="border border-gray-300 py-2 px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userQueries.map((query, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                            <td className="border  border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200">
                                                {query.name}
                                            </td>
                                            <td className="border  border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200">
                                                {query.email}
                                            </td>
                                            <td className="border  border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200">
                                                {query.name}
                                            </td>
                                            <td className="border  border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200">
                                                {query.phone}
                                            </td>
                                            <td className="border  border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200">
                                                {query.message}
                                            </td>
                                            <td className="border hover:underline border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200">
                                                {formatDate(query.createdAt)}
                                            </td>
                                            <td className="border hover:underline border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-200">
                                                <button className='admin-delete-btn' onClick={() => handleDelete(query.queryToken, index)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    }

                </InfiniteScroll>
            </div>

        )
    }


    return (
        <div className='flex items-center justify-center h-1/2'>
            No User Queries Found
        </div>
    )
}

export default UserQueries