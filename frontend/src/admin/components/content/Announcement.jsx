import React, { useEffect, useState } from "react";
import "./content.css";
import AOS from "aos";
import axios from "axios";
import logo from "../../assets/images/default.png";
import Notify from "../modals/Notify";
import UpdateModal from "../modals/UpdateModal";
import AddModal from "../modals/AddModal";
import axiosInstance, { fetchCsrfToken } from "../../middleware/axios";

const Announcement = () => {
  const [anns, setAnn] = useState([]);
  const [notify, setNotify] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const fetchAnns = async () => {
    try {
      const { data } = await axiosInstance.get("/data/getAnns");
      setAnn(data);
    } catch (error) {
      throw error;
    }
  };

  const deleteAnn = async (annId) => {
    try {
      await axiosInstance.post(
        "/data/deleteAnn",
        { id: annId },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      setNotify(true);
      fetchAnns();
    } catch (error) {
      throw error;
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

    fetchAnns();
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
        <h1
          style={{ fontSize: "2.2rem", fontWeight: "700", marginBottom: "3%" }}
        >
          Duyurular
        </h1>
        <button
          className="py-2 px-4 bg-primary"
          style={{
            width: "15%",
            color: "#fff",
            borderRadius: "10px",
            marginBottom: "2%",
          }}
          data-bs-toggle="modal"
          data-bs-target={`#add-ann`}
        >
          Duyuru Ekle
        </button>
        <AddModal id={`add-ann`} onUpdate={fetchAnns} />
      </div>

      <div className="row g-3 ">
        {anns.map((ann, index) => (
          <div
            key={index}
            className="col-md-4"
            style={{ minHeight: "50vh", height: "50vh" }}
          >
            <div className="card h-100">
              <div className="card-header d-flex justify-center items-center h-[45%]">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${ann.image}`}
                  alt="..."
                  className="card-img-top w-[60%] h-100"
                />
              </div>
              <div className="card-body d-flex flex-column justify-between">
                <h3 className="card-title">{ann.title}</h3>
                <p className="card-text">{ann.text}</p>
                <div className="card-actions">
                  <button
                    className="card-btn bg-danger"
                    onClick={() => deleteAnn(ann.id)}
                  >
                    Sil
                  </button>
                  <button
                    className="card-btn bg-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#ann-${ann.id}`}
                  >
                    Güncelle
                  </button>
                </div>
              </div>
              <UpdateModal
                data={ann}
                id={`ann-${ann.id}`}
                onUpdate={fetchAnns}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;
