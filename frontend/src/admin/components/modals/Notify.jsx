import React, { useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notify = ({ message }) => {
  useEffect(() => {
    toast.success(`Başarıyla ${message}`, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }, [message]);

  return <ToastContainer />;
};

export default Notify;
