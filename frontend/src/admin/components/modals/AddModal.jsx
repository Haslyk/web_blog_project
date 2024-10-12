import axios from "axios";
import React, { useState } from "react";
import Notify from "./Notify";

const AddModal = ({ id, onUpdate }) => {
  const [notify, setNotify] = useState(false);

  const [formData, setFormData] = useState({
    file: null,
    title: "",
    text: "",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file: file,
    });
    setPreview(URL.createObjectURL(file));
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleSubmit = async (e) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.file);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("text", formData.text);

      setNotify(true);
      e.preventDefault();
      await axios.post(
        `http://localhost:5000/data/add${capitalizeFirstLetter(
          id.split("-")[1]
        )}`,
        formDataToSend ,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onUpdate();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div
      className={`modal fade`}
      id={`${id}`}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      {notify && <Notify message={"Eklendi"} />}
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Ekle
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Kapak Resmi
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                />
                {preview && (
                  <div className="mt-3 d-flex justify-center items-center">
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ width: "120px", height: "120px" }}
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Başlık
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Açıklama
                </label>
                <textarea
                  className="form-control"
                  id="text"
                  name="text"
                  rows="3"
                  value={formData.text}
                  onChange={handleChange}
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              İptal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
