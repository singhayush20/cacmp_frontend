import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import DownloadApp from "./DownloadApp";
import Footer from "./Footer";
import Slideshow from "./Slideshow";
const Home = () => {
    return (
        <div className="h-100 w-full bg-slate-100">
            <Header />
            <Slideshow />
            <Hero />
            <Features />
            <DownloadApp />
            <Footer />
        </div>
    );
}

export default Home;
