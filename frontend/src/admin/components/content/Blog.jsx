import React, { useEffect, useState } from "react";
import "./content.css";
import AOS from "aos";
import axiosInstance, { fetchCsrfToken } from "../../middleware/axios";
import Notify from "../modals/Notify";
import UpdateModal from "../modals/UpdateModal";
import AddModal from "../modals/AddModal";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [notify, setNotify] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");



  const fetchBlogs = async () => {
    try {
      const { data } = await axiosInstance.get("/data/getBlogs");
      setBlogs(data);
    } catch (error) {
      console.error("Bloglar alınırken bir hata oluştu:", error);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await axiosInstance.post(
        "/data/deleteBlog",
        { id: blogId },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      setNotify(true);
      fetchBlogs();
    } catch (error) {
      console.error("Blog silinirken bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    const getToken = async () => {
      const token = await fetchCsrfToken();
      setCsrfToken(token);
    };
    getToken();
    AOS.init();
    AOS.refresh();
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (notify) {
      const timer = setTimeout(() => {
        setNotify(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [notify]);

  return (
    <div className="w-100 h-100 overflow-y-scroll">
      {notify && <Notify message={"Silindi"} />}
      <div className="flex justify-between items-center w-100">
        <h1 style={{ fontSize: "2.2rem", fontWeight: "700", marginBottom: "3%" }}>
          Bloglar
        </h1>
        <button
          className="py-2 px-4 bg-primary"
          style={{ width: "15%", color: "#fff", borderRadius: "10px", marginBottom: "2%" }}
          data-bs-toggle="modal"
          data-bs-target={`#add-blog`}
        >
          Blog Ekle
        </button>
        <AddModal id={`add-blog`} onUpdate={fetchBlogs} />
      </div>
      <div className="row g-3 ">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="col-md-4"
            style={{ minHeight: "50vh", height: "50vh" }}
          >
            <div className="card h-100">
              <div className="card-header d-flex justify-center items-center h-[45%]">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${blog.image}`}
                  alt="..."
                  className="card-img-top w-[60%] h-100"
                />
              </div>
              <div className="card-body d-flex flex-column justify-between">
                <h3 className="card-title">{blog.title}</h3>
                <p className="card-text">{blog.text}</p>
                <div className="card-actions">
                  <button
                    className="card-btn bg-danger"
                    onClick={() => deleteBlog(blog.id)}
                  >
                    Sil
                  </button>
                  <button
                    className="card-btn bg-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#blog-${blog.id}`}
                  >
                    Güncelle
                  </button>
                </div>
              </div>
              <UpdateModal data={blog} id={`blog-${blog.id}`} onUpdate={fetchBlogs} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
