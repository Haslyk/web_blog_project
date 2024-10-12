import React, { useEffect, useState } from "react";
import "./content.css";
import AOS from "aos";
import axios from "axios";
import logo from "../../assets/images/default.png";
import Notify from "../modals/Notify";
import UpdateModal from "../modals/UpdateModal";
import AddModal from "../modals/AddModal";
import axiosInstance, { fetchCsrfToken } from "../../middleware/axios";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [notify, setNotify] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const fetchEvents = async () => {
    try {
      const { data } = await axiosInstance.get("/data/getEvents");
      setEvents(data);
    } catch (error) {
      throw error;
    } finally {
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axiosInstance.post(
        "/data/deleteEvent",
        { id: eventId },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      setNotify(true);
      fetchEvents();
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

    fetchEvents();
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
          Etkinlikler
        </h1>
        <button
          className="py-2 px-4 bg-primary"
          style={{width: "15%", color: "#fff", borderRadius: "10px", marginBottom: "2%"}}
          data-bs-toggle="modal"
          data-bs-target={`#add-event`}
        >
          Etkinlik Ekle
        </button>
        <AddModal id={`add-event`} onUpdate={fetchEvents} />
      </div>
      <div className="row g-3 ">
        {events.map((event,index) => (
          <div
            key={index}
            className="col-md-4"
            style={{ minHeight: "50vh", height: "50vh" }}
          >
            <div className="card h-100">
              <div className="card-header d-flex justify-center items-center h-[45%]">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${event.image}`}
                  alt="..."
                  className="card-img-top w-[60%] h-100"
                />
              </div>
              <div className="card-body d-flex flex-column justify-between">
                <h3 className="card-title">{event.title}</h3>
                <p className="card-text">{event.text}</p>
                <div className="card-actions">
                  <button className="card-btn bg-danger" onClick={() => deleteEvent(event.id)}>Sil</button>
                  <button className="card-btn bg-primary" data-bs-toggle="modal" data-bs-target={`#event-${event.id}`}>Güncelle</button>
                </div>
              </div>
              
              <UpdateModal data={event} id={`event-${event.id}`} onUpdate={fetchEvents}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;
