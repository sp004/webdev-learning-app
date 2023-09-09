import "react-responsive-carousel/lib/styles/carousel.min.css";
import { sliderItems } from "../../utils/data";
import "./Header.scss";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Header = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <Slider {...settings}>
      {sliderItems.map((item) => (
        <div key={item.id}>
          <div style={{ background: `${item.bg}` }} className="slider-item">
            <div className="header-wrapper">
              <div className="header-info">
                <h1 className="header-info--title">{item.title}</h1>
                <p className="header-info--description">{item.desc}</p>
                {item?.link && <Link to={item?.link}>{item?.button}</Link>}
              </div>
              <div className="header-img">
                <img src={item.img} alt={item.title} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Header;
