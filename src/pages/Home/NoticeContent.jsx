import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import { useParams } from 'react-router-dom';
import LoadingIndicator1 from '../../components/LoadingIndicator1/LoadingIndicator1';
import { toast } from 'react-toastify';
import Header from './Header';
import Footer from './Footer';
function NoticeContent() {
    const { alertToken } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [noticeData, setNoticeData] = useState(null);

    useEffect(() => {
        fetchNoticeDetails();
    }, []);

    const fetchNoticeDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}/${apiPrefixV1}/alert?token=${alertToken}`
            );
            const code = response.data.code;
            if (code === 2000) {
                setNoticeData(response.data.data);
            } else {
                toast.error('Failed to fetch data!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error('Some error occurred!', { autoClose: true, position: 'top-right', pauseOnHover: false });
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100">
            <Header />
            <div className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <LoadingIndicator1 color="#898989" size={50} />
                    </div>
                ) : noticeData ? (
                    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-semibold mb-4 text-gray-800">{noticeData.subject}</h1>
                        <p className="text-gray-700 mb-4">{noticeData.message}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {noticeData.alertImages.map((image, index) => (
                                <img key={index} src={image} alt={`Notice ${index + 1}`} className="w-full h-auto rounded-lg border border-gray-300" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No notice found!</p>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default NoticeContent;
