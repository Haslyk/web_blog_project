import logo from "../../../Images/site_assets/uni_logo.png";
import ContactCard from "../contactCard/ContactCard";
import blogBg from "../../../Images/site_assets/blog-bg.svg";
import "aos/dist/aos.css";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const Announcements = ({ anns }) => {
  const { darkMode } = useContext(ThemeContext);
  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "40px",
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
    prevArrow: <ArrowCircleLeftIcon sx={{ zIndex: 100 }} />,
    nextArrow: <ArrowCircleRightIcon />,
  };

  return (
    <section
      className="section blog has-bg-image"
      id="announcements"
      aria-label="contact"
      style={{
        backgroundImage: `url(${blogBg})`,
        filter: darkMode ? "invert(1)" : "invert(0)",
      }}
    >
      <div
        className="container"
        style={{ filter: darkMode ? "invert(1)" : "invert(0)" }}
      >
        <p className="section-subtitle" style={{ color: "var(--gray-web)" }}>
          Duyurular
        </p>
        <h2 className="h2 section-title" data-aos="fade-right">
          En Güncel Duyurular Burada
        </h2>
        <Slider {...sliderSettings}>
          {anns.map((ann) => (
            <div className="dev_card">
              <ContactCard
                image={`${process.env.REACT_APP_API_URL}/${ann.image}`}
                name={ann.title}
                data={ann}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Announcements;
