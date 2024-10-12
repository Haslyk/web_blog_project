import "./home.css";
/* IMAGES IMPORT */
import category1 from "../../../Images/site_assets/category-1.svg";
import category2 from "../../../Images/site_assets/category-2.svg";
import category3 from "../../../Images/site_assets/category-3.svg";
import category4 from "../../../Images/site_assets/category-4.svg";
import shape4 from "../../../Images/site_assets/about-shape-4.svg";
import heroBg from "../../../Images/site_assets/Background.webp";
import blog from "../../../Images/site_assets/blog.png";
/* ----------------------------------------------------*/
import Navbar from "../../component/navbar/Navbar";
import Category from "../../component/category/Category";
import Footer from "../../component/footer/Footer";
import Announcements from "../../component/announcements";
import Notice from "../../component/notice/Notice";
import Spinner from "../../component/spinner/Spinner";
import LoadingScreen from "../../component/loadingScreen/LoadingScreen";

import { useEffect, useRef, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation, Pagination } from "swiper";
import AOS from "aos";
import "aos/dist/aos.css";
import { ThemeContext } from "../../context/ThemeContext";

import { io } from "socket.io-client";
import { Box, Modal, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const [events, setEvents] = useState([]);
  const [anns, setAnns] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [dailyVisitorCount, setDailyVisitorCount] = useState(0);

  const [noticeData, setNoticeData] = useState({});
  const [noticeOpen, setNoticeOpen] = useState(false);

  const [eventData, setEventData] = useState({});
  const [eventOpen, setEventOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/data/getEvents");
      setEvents(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAnns = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/data/getAnns");
      setAnns(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/data/getBlogs");
      setBlogs(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init();
    AOS.refresh();

    fetchEvents();
    fetchAnns();
    fetchBlogs();

    let userId = sessionStorage.getItem("userId");

    if (!userId) {
      userId = Math.random().toString(36).substring(2);
      sessionStorage.setItem("userId", userId);
    }

    const socket = io("http://localhost:5000", {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Socket.IO sunucusuna bağlandı!");
    });

    socket.on("visitorCount", (count) => {
      setVisitorCount(count);
    });

    socket.on("dailyVisitorCount", (count) => {
      setDailyVisitorCount(count);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNoticeClick = (data) => {
    setNoticeData(data);
    setNoticeOpen(true);
  };

  const handleEventClick = (data) => {
    setEventData(data);
    setEventOpen(true);
  };

  const handleNoticeClose = () => setNoticeOpen(false);
  const handleEventClose = () => setEventOpen(false);

  const progressBarHandler = () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scroll = `${totalScroll / windowHeight}`;
    const progressBar = document.getElementById("progressBar");
    progressBar.style.transform = `scale(${scroll},1)`;
    progressBar.style.opacity = `${scroll}`;
  };
  window.addEventListener("scroll", progressBarHandler);

  const backtopRef = useRef();
  window.addEventListener("scroll", () => {
    if (backtopRef.current !== null) {
      if (window.scrollY > 400) {
        backtopRef.current?.classList.add("active");
      } else {
        backtopRef.current?.classList.remove("active");
      }
    }
  });

  const { ref: playRef, inView, entry } = useInView({ threshold: 0.6 });
  if (entry !== undefined) {
    entry.target.muted = true;
    inView ? entry.target.play() : entry.target.pause();
  }

  return pageLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Helmet>
        <title>SAMU Blog</title>
      </Helmet>

      <Navbar activeUser={visitorCount} dailyUser={dailyVisitorCount} />

      <main>
        <article>
          <div id="progressBarContainer">
            <div id="progressBar"></div>
          </div>
          <section
            className="section hero has-bg-image"
            aria-label="home"
            style={{
              backgroundImage: `url(${heroBg})`,
              filter: darkMode ? "invert(1)" : "invert(0)",
            }}
          >
            <div className="container">
              <div
                className="hero-content"
                data-aos="fade-right"
                data-aos-offset="200"
                data-aos-duration="1000"
                style={{ filter: darkMode ? "invert(0.99)" : "invert(0)" }}
              >
                <h1 className="h1 section-title">
                  Samsun Üniversitesi{" "}
                  <span
                    className="span"
                    data-aos="zoom-in"
                    data-aos-delay="500"
                  >
                    Duyuru
                  </span>{" "}
                  ve{" "}
                  <span
                    className="span"
                    data-aos="zoom-in"
                    data-aos-delay="500"
                  >
                    Blog
                  </span>{" "}
                  sayfasına hoşgeldiniz.
                </h1>
                <p className="hero-text">
                  Burada en güncel haberler, önemli duyurular ve etkinlikler
                  hakkında bilgi bulabilirsiniz. Öğrenciler, akademisyenler ve
                  personel için her şey tek bir yerde! Her zaman güncel kalmak
                  için bizi takip edin.
                </p>
              </div>

              <div className="hero-banner h-[55vh] flex flex-col items-center">
                {blogs.length > 0 && (
                    <marquee
                      behaviour="scroll"
                      scrollamount="4"
                      style={{ width:"50%", margin: "2% 5%", fontSize: "24px"}}
                    >
                      Tüm Bloglar
                    </marquee>
                  )}
                <div
                  className="noticeboard"
                  data-aos="flip-right"
                  data-aos-duration="1000"
                  style={{
                    padding: "5% 2%",
                    alignItems: blogs.length === 0 ? "center" : "",
                    justifyContent: blogs.length === 0 ? "center" : "",
                  }}
                >
                  {loading ? (
                    <Spinner width="20px" height="20px" />
                  ) : blogs.length > 0 ? (
                    blogs.map((blog) => (
                      <Notice
                        key={blog.id}
                        notice={blog.title}
                        onClick={() => handleNoticeClick(blog)}
                      />
                    ))
                  ) : (
                    !loading && <img style={{ width: "100%" }} src={blog} />
                  )}
                </div>
                {noticeOpen && (
                  <Modal
                    open={noticeOpen}
                    onClose={handleNoticeClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${noticeData.image}`}
                        className="w-48 h-48 mb-12"
                      />
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        {noticeData.title}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {noticeData.text}
                      </Typography>
                    </Box>
                  </Modal>
                )}
              </div>
            </div>
          </section>

          <section className="section category" aria-label="category">
            <div className="container">
              <h2 className="h2 section-title">
                Farklı Alanlarda{" "}
                <span className="span" data-aos="zoom-in">
                  Duyurular
                </span>
              </h2>
              <ul
                className="grid-list cate"
                style={{ marginTop: "5%" }}
                data-aos="flip-right"
                data-aos-duration="1000"
              >
                <li>
                  <Category
                    image={category1}
                    cardTitle="Akademik Duyurular"
                    cardText="Akademik konularla ilgili tüm bilgileri ve önemli kaynakları burada bulabilirsiniz."
                    style="170, 75%, 41%"
                  />
                </li>

                <li>
                  <Category
                    image={category2}
                    cardTitle="Yarışma Duyuruları"
                    cardText="Geliştirme ile ilgili tüm bilgileri ve önemli kaynakları burada bulabilirsiniz."
                    style="351, 83%, 61%"
                  />
                </li>

                <li>
                  <Category
                    image={category3}
                    cardTitle="Etkinlik Duyuruları"
                    cardText="Etkinlikler hakkında nasıl ve nerede başlayacağınızla ilgili tüm bilgileri burada bulabilirsiniz."
                    style="229, 75%, 58%"
                  />
                </li>

                <li>
                  <Category
                    image={category4}
                    cardTitle="Workshop Duyuruları"
                    cardText="Yaklaşan workshoplar hakkında tüm ilgili bilgileri ve haberleri burada bulabilirsiniz."
                    style="42, 94%, 55%"
                  />
                </li>
              </ul>
            </div>
          </section>

          <section className="section about" id="about" aria-label="about">
            <div className="container">
              <div className="about-content">
                <p
                  className="section-subtitle"
                  style={{ color: "var(--gray-web)" }}
                >
                  Biz Kimiz?
                </p>
                <h3
                  className="h2 section-title"
                  data-aos="fade-right"
                  data-aos-duration="400"
                >
                  Bizler Samsun Üniversitesi{" "}
                  <span
                    className="span"
                    data-aos="zoom-in"
                    data-aos-delay="300"
                  >
                    Yazılımcılarıyız.
                  </span>
                </h3>
                <p
                  className="section-text"
                  style={{ color: "var(--gray-web)" }}
                >
                  Samsun Üniversitesi Yazılımcıları olarak, yazılım geliştirme
                  ve yazılım mühendisliği ile ilgili çeşitli kaynakları tek bir
                  platformda topladık. Amacımız, öğrencilere yeni kaynakları
                  bulmaları ve öğrenmeleri için geniş kapsamlı bir platform
                  sunmaktır. Öğrencilerimiz, bu platform sayesinde internette
                  uzun süre vakit harcamadan, ihtiyaç duydukları bilgilere
                  kolayca ulaşabilirler.
                </p>
                <ul className="about-list" style={{ fontSize: "1.5rem" }}>
                  <li className="about-item">
                    <ion-icon
                      name="checkmark-done-outline"
                      aria-hidden="true"
                    ></ion-icon>
                    <span className="span" data-aos="zoom-in">
                      Ücretsiz Erişim
                    </span>
                  </li>
                  <li className="about-item">
                    <ion-icon
                      name="checkmark-done-outline"
                      aria-hidden="true"
                    ></ion-icon>
                    <span
                      className="span"
                      data-aos="zoom-in"
                      data-aos-delay="200"
                    >
                      Kolay Kullanım
                    </span>
                  </li>
                </ul>
                <img
                  src={shape4}
                  width={100}
                  height={100}
                  loading="lazy"
                  alt="background shape"
                  className="shape about-shape-4"
                />
              </div>

              <div className="past-videos">
                <span>Geçmiş Etkinlikler</span>
                <Swiper
                  effect={"coverflow"}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 130,
                    modifier: 2.2,
                  }}
                  navigation={{
                    prevEl: ".prev",
                    nextEl: ".next",
                    clickable: true,
                  }}
                  modules={[Navigation, Pagination, EffectCoverflow]}
                  className="swiper-container"
                >
                  {events.map((event) => (
                    <SwiperSlide key={event?._id}>
                      {
                        <div className="iframe">
                          <img
                            style={{
                              width: "200px",
                              height: "200px",
                              cursor: "pointer",
                            }}
                            src={`${process.env.REACT_APP_API_URL}/${event.image}`}
                            onClick={() => handleEventClick(event)}
                          />
                        </div>
                      }
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="navigation-btns">
                  <div className="navigation-btn prev">
                    <ion-icon name="arrow-back-outline"></ion-icon>
                  </div>
                  <div className="navigation-btn next">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                </div>
                {eventOpen && (
                  <Modal
                    open={eventOpen}
                    onClose={handleEventClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${eventData.image}`}
                        className="w-48 h-48 mb-12"
                      />
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        {eventData.title}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {eventData.text}
                      </Typography>
                    </Box>
                  </Modal>
                )}
              </div>
            </div>
          </section>

          <Announcements anns={anns} />
        </article>
      </main>

      <Footer />

      <a
        href="#"
        className="back-top-btn"
        aria-label="back top top"
        ref={backtopRef}
      >
        <ion-icon name="chevron-up" aria-hidden="true"></ion-icon>
      </a>

      <style>
        {`
            .swiper-slide {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              backdrop-filter: blur(2.5px);
            }
            .swiper-slide-shadow-left {
              display: none;
            }
            .swiper-slide-shadow-right {
              display: none;
            }
            .swiper-pagination-bullets {
              display: none;
            }
          `}
      </style>
    </>
  );
};

export default Home;
