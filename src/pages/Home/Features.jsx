import React from 'react'
import hero1 from '../../assets/hero1.svg'
import feedback from '../../assets/feedback.svg'
import alert from '../../assets/alert.svg'
import article from '../../assets/article.svg'
import complaint from '../../assets/complaint.svg'
function Features() {
    return (
        <div className='w-full h-auto flex flex-wrap py-10 gap-2 justify-center items-center'>

            <div className='w-[300px] h-[400px] py-2 px-2 bg-slate-300 flex flex-col items-center justify-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-b from-gray-300 to-gray-400'>
                <div>
                    <img className='w-[200px] h-auto ' src={article} alt="" />
                </div>
                <div className='text-2xl font-semibold'>Latest News</div>
                <div className='text-1xl font-medium italic text-center'>Catch with the latest news about development in your city.</div>
            </div>

            <div className='w-[300px] h-[400px] py-2 px-2 bg-slate-300 flex flex-col items-center justify-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-b from-gray-300 to-gray-400'>
                <div>
                    <img className='w-[200px] h-auto ' src={alert} alt="" />
                </div>
                <div className='text-2xl font-semibold'>Alerts</div>
                <div className='text-1xl font-medium italic text-center'>Get notified about any latest developments in your city.</div>
            </div>
            <div className='w-[300px] h-[400px] py-2 px-2 bg-slate-300 flex flex-col items-center justify-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-b from-gray-300 to-gray-400'>
                <div>
                    <img className='w-[200px] h-auto ' src={complaint} alt="" />
                </div>
                <div className='text-2xl font-semibold'>File Complaints</div>
                <div className='text-1xl font-medium italic text-center'>Facing a problem? File a complaint with department.</div>
            </div>
            <div className='w-[300px] h-[400px] py-2 px-2 bg-slate-300 flex flex-col items-center justify-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-b from-gray-300 to-gray-400'>
                <div>
                    <img className='w-[200px] h-auto ' src={feedback} alt="" />
                </div>
                <div className='text-2xl font-semibold'>Feedback</div>
                <div className='text-1xl font-medium italic text-center'>Check status of your complaints and review them when resolved.</div>
            </div>
        </div>
    )
}

export default Features