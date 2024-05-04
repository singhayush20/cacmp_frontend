import hero1 from '../../assets/hero1.svg'
import { Fade } from "react-awesome-reveal";

export default function Hero() {
    return (
        <div className='w-full md:h-[700px] h-auto flex md:flex-row flex-col md:py-15 py-10 gap-4 md:gap-0'>
            <div className='w-full md:w-full h-full  flex flex-col justify-center items-center  px-20'>
                <Fade>
                    <p className='text-3xl md:text-5xl font-semibold'>One place to get all the information about your city&apos;s development.</p>
                </Fade>
                <Fade><p className='text=2xl md:text-4xl font-medium italic mt-2'>Seamless Access to Municipal Services at Your Fingertips!</p>
                </Fade>
            </div>

            <div className='w-full md:w-full h-full flex justify-center items-center'>
                <Fade>
                    <img className='w-[90%] h-auto mx-auto ' src={hero1} alt="" />
                </Fade>
            </div>
        </div>
    )
}
