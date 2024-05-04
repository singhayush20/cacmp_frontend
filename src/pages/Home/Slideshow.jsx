import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image1 from '../../assets/images/image1.jpg';
import image3 from '../../assets/images/image3.jpg';
import image4 from '../../assets/images/image4.jpg';

const Slideshow = () => {
  const images = [
    { id: 1, url: image1 },
    { id: 3, url: image3 },
    { id: 4, url: image4 },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className='max-w-[100vw] max-h-[90vh]'>
      <Slider {...settings} >
        {images.map(image => (
          <div key={image.id}>
            <img
              src={image.url}
              alt={`Image ${image.id}`}
              className="max-h-[90vh] w-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Slideshow;