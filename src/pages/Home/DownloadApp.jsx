import React from 'react';
import downloadapp from '../../assets/downloadapp.svg';

const DownloadApp = () => {
    return (
        <section className="bg-gray-100 py-10">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between">
                <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                    <img className="w-64 md:w-auto" src={downloadapp} alt="Download App" />
                </div>
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
                    <p className="text-lg text-gray-700 mb-6">Stay connected on the go. Download our consumer-facing mobile app for easy access to city services, news, and more.</p>
                    <div className="flex justify-center md:justify-start">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">Download Now</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DownloadApp;
